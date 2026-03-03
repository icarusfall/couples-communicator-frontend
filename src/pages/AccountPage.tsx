import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { apiFetch } from "../api";
import { clearConversation } from "../storage";
import { clearCryptoKey } from "../crypto";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<
    "history" | "document" | "account" | null
  >(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleClearHistory = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await clearConversation(user.id);
      setMessage("Conversation history cleared.");
    } catch {
      setMessage("Failed to clear history.");
    } finally {
      setBusy(false);
      setConfirmAction(null);
    }
  };

  const handleClearDocument = async () => {
    setBusy(true);
    try {
      await apiFetch("/account/shared-doc", { method: "DELETE" });
      setMessage("Shared document cleared.");
    } catch {
      setMessage("Failed to clear document.");
    } finally {
      setBusy(false);
      setConfirmAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    try {
      await apiFetch("/account", { method: "DELETE" });
      if (user) {
        await clearConversation(user.id).catch(() => {});
      }
      clearCryptoKey();
      logout();
      navigate("/login");
    } catch {
      setMessage("Failed to delete account.");
      setBusy(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="account-page">
      <h2>Account settings</h2>

      {message && <p className="account-message">{message}</p>}

      <div className="account-section">
        <h3>Clear conversation history</h3>
        <p>Removes all locally stored chat history from this device. This cannot be undone.</p>
        <button
          className="btn-danger"
          onClick={() => { setConfirmAction("history"); setMessage(""); }}
        >
          Clear history
        </button>
      </div>

      <div className="account-section">
        <h3>Clear shared document</h3>
        <p>Deletes your shared document from the server. Your partner's document is not affected.</p>
        <button
          className="btn-danger"
          onClick={() => { setConfirmAction("document"); setMessage(""); }}
        >
          Clear document
        </button>
      </div>

      <div className="account-section">
        <h3>Delete account</h3>
        <p>Permanently deletes your account, shared document, and unlinks you from your partner. This cannot be undone.</p>
        <button
          className="btn-danger"
          onClick={() => { setConfirmAction("account"); setMessage(""); setDeleteInput(""); }}
        >
          Delete my account
        </button>
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="confirm-modal-overlay" onClick={() => !busy && setConfirmAction(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            {confirmAction === "history" && (
              <>
                <h3>Clear conversation history?</h3>
                <p>All chat history on this device will be permanently deleted.</p>
                <div className="confirm-modal-actions">
                  <button className="btn-secondary" onClick={() => setConfirmAction(null)} disabled={busy}>Cancel</button>
                  <button className="btn-danger" onClick={handleClearHistory} disabled={busy}>
                    {busy ? "Clearing..." : "Clear history"}
                  </button>
                </div>
              </>
            )}
            {confirmAction === "document" && (
              <>
                <h3>Clear shared document?</h3>
                <p>Your shared document will be deleted from the server.</p>
                <div className="confirm-modal-actions">
                  <button className="btn-secondary" onClick={() => setConfirmAction(null)} disabled={busy}>Cancel</button>
                  <button className="btn-danger" onClick={handleClearDocument} disabled={busy}>
                    {busy ? "Clearing..." : "Clear document"}
                  </button>
                </div>
              </>
            )}
            {confirmAction === "account" && (
              <>
                <h3>Delete your account?</h3>
                <p>This is permanent. Type <strong>DELETE</strong> to confirm.</p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  autoFocus
                />
                <div className="confirm-modal-actions">
                  <button className="btn-secondary" onClick={() => setConfirmAction(null)} disabled={busy}>Cancel</button>
                  <button
                    className="btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={busy || deleteInput !== "DELETE"}
                  >
                    {busy ? "Deleting..." : "Delete account"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
