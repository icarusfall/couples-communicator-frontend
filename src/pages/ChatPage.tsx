import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../auth";
import { apiFetch } from "../api";
import { hasCryptoKey, encrypt, decrypt } from "../crypto";
import PassphraseModal from "../components/PassphraseModal";
import DocumentPanel from "../components/DocumentPanel";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://couples-communicator-production.up.railway.app";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CoupleStatus {
  paired: boolean;
  coupleId?: string;
  coupleSalt?: string;
  partnerPseudonym?: string | null;
}

interface SharedDocResponse {
  documents: Array<{
    userId: string;
    encryptedContent: string;
    iv: string;
  }>;
}

// Strip <doc-proposal>...</doc-proposal> tags from text, return display text and proposal
function extractProposal(raw: string): { display: string; proposal: string | null } {
  const openTag = "<doc-proposal>";
  const closeTag = "</doc-proposal>";

  const openIdx = raw.indexOf(openTag);
  if (openIdx === -1) return { display: raw, proposal: null };

  const closeIdx = raw.indexOf(closeTag);
  if (closeIdx === -1) {
    // Tag opened but not yet closed (still streaming) — hide from open tag onward
    return { display: raw.slice(0, openIdx).trimEnd(), proposal: null };
  }

  const proposal = raw.slice(openIdx + openTag.length, closeIdx).trim();
  const display = (raw.slice(0, openIdx) + raw.slice(closeIdx + closeTag.length)).trim();
  return { display, proposal };
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Shared document state
  const [coupleSalt, setCoupleSalt] = useState<string | null>(null);
  const [needsPassphrase, setNeedsPassphrase] = useState(false);
  const [myDocument, setMyDocument] = useState("");
  const [partnerDocument, setPartnerDocument] = useState("");
  const [myEncryptedDoc, setMyEncryptedDoc] = useState<{ encryptedContent: string; iv: string } | null>(null);

  // Document panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"proposal" | "view">("view");
  const [proposalText, setProposalText] = useState<string | undefined>(undefined);

  // Track raw assistant content for proposal detection
  const rawAssistantRef = useRef("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [input]);

  // Fetch couple status on mount
  useEffect(() => {
    apiFetch<CoupleStatus>("/couple/status").then((data) => {
      if (data.coupleSalt) {
        setCoupleSalt(data.coupleSalt);
        if (!hasCryptoKey()) {
          setNeedsPassphrase(true);
        }
      }
    }).catch((err) => console.error("Failed to fetch couple status:", err));
  }, []);

  // Fetch and decrypt shared docs after key is available
  const loadDocuments = useCallback(async () => {
    try {
      const data = await apiFetch<SharedDocResponse>("/shared-doc");
      for (const doc of data.documents) {
        try {
          const plaintext = await decrypt(doc.encryptedContent, doc.iv);
          if (doc.userId === user?.id) {
            setMyDocument(plaintext);
            setMyEncryptedDoc({ encryptedContent: doc.encryptedContent, iv: doc.iv });
          } else {
            setPartnerDocument(plaintext);
          }
        } catch (err) {
          console.error("Failed to decrypt document:", err);
        }
      }
    } catch (err) {
      console.error("Failed to load shared docs:", err);
    }
  }, [user?.id]);

  const handleUnlocked = useCallback(() => {
    setNeedsPassphrase(false);
    loadDocuments();
  }, [loadDocuments]);

  const handleApproveDocument = async (text: string) => {
    try {
      const { ciphertext, iv } = await encrypt(text);
      await apiFetch("/shared-doc", {
        method: "PUT",
        body: JSON.stringify({ encryptedContent: ciphertext, iv }),
      });
      setMyDocument(text);
      setMyEncryptedDoc({ encryptedContent: ciphertext, iv });
      setPanelOpen(false);
      setPanelMode("view");
      setProposalText(undefined);
    } catch (err) {
      console.error("Failed to save document:", err);
    }
  };

  const handleDismissProposal = () => {
    setProposalText(undefined);
    setPanelMode("view");
    setPanelOpen(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);
    rawAssistantRef.current = "";

    // Add empty assistant message to fill in
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          myDocument: myDocument || undefined,
          partnerDocument: partnerDocument || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.delta) {
              rawAssistantRef.current += parsed.delta;
              const { display, proposal } = extractProposal(rawAssistantRef.current);

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: display,
                };
                return updated;
              });

              if (proposal) {
                setProposalText(proposal);
                setPanelMode("proposal");
                setPanelOpen(true);
              }
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant" && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: "Sorry, something went wrong. Please try again.",
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (needsPassphrase && coupleSalt) {
    return (
      <PassphraseModal
        coupleSalt={coupleSalt}
        existingDoc={myEncryptedDoc}
        onUnlocked={handleUnlocked}
      />
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Hi {user?.pseudonym}, what's on your mind?</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble-${msg.role}`}>
            {msg.content || (streaming && i === messages.length - 1 ? "\u2026" : "")}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message\u2026"
          disabled={streaming}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={streaming || !input.trim()}
        >
          Send
        </button>
      </div>

      {/* Document toggle button */}
      {coupleSalt && (
        <button
          className="doc-panel-toggle"
          onClick={() => {
            setPanelMode("view");
            setPanelOpen((prev) => !prev);
          }}
          title="Shared document"
        >
          {panelOpen ? "\u2715" : "\u{1F4C4}"}
        </button>
      )}

      <DocumentPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        mode={panelMode}
        proposalText={proposalText}
        currentDocument={myDocument}
        onApprove={handleApproveDocument}
        onDismiss={handleDismissProposal}
      />
    </div>
  );
}
