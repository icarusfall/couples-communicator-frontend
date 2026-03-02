import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "proposal" | "view";
  proposalText?: string;
  currentDocument: string;
  onApprove: (text: string) => void;
  onDismiss: () => void;
}

export default function DocumentPanel({
  open,
  onClose,
  mode,
  proposalText,
  currentDocument,
  onApprove,
  onDismiss,
}: Props) {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (mode === "proposal" && proposalText !== undefined) {
      // If user already has a document, append proposal; otherwise use proposal as-is
      setText(
        currentDocument
          ? currentDocument + "\n\n" + proposalText
          : proposalText
      );
    } else {
      setText(currentDocument);
      setEditing(false);
    }
  }, [mode, proposalText, currentDocument]);

  const isProposal = mode === "proposal";

  return (
    <div className={`doc-panel ${open ? "open" : ""}`}>
      <div className="doc-panel-header">
        <h3>{isProposal ? "Document proposal" : "Your shared document"}</h3>
        <button className="doc-panel-close" onClick={onClose} aria-label="Close panel">
          &times;
        </button>
      </div>

      <div className="doc-panel-body">
        {isProposal || editing ? (
          <textarea
            className="doc-panel-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="doc-panel-content">
            {currentDocument || (
              <span className="doc-panel-empty">No document yet. Chat with your coach and they may suggest something to share.</span>
            )}
          </div>
        )}
      </div>

      <div className="doc-panel-actions">
        {isProposal ? (
          <>
            <button onClick={() => onApprove(text)} disabled={!text.trim()}>
              Approve
            </button>
            <button className="doc-panel-btn-secondary" onClick={onDismiss}>
              Dismiss
            </button>
          </>
        ) : editing ? (
          <>
            <button onClick={() => { onApprove(text); setEditing(false); }} disabled={!text.trim()}>
              Save
            </button>
            <button className="doc-panel-btn-secondary" onClick={() => { setText(currentDocument); setEditing(false); }}>
              Cancel
            </button>
          </>
        ) : (
          currentDocument && (
            <button className="doc-panel-btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )
        )}
      </div>
    </div>
  );
}
