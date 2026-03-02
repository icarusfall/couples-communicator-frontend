import { useState } from "react";
import { deriveKey, decrypt } from "../crypto";

interface Props {
  coupleSalt: string;
  existingDoc: { encryptedContent: string; iv: string } | null;
  onUnlocked: () => void;
}

export default function PassphraseModal({ coupleSalt, existingDoc, onUnlocked }: Props) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    setError("");
    setLoading(true);

    try {
      await deriveKey(passphrase, coupleSalt);

      // If user has an existing document, validate by attempting to decrypt
      if (existingDoc) {
        try {
          await decrypt(existingDoc.encryptedContent, existingDoc.iv);
        } catch {
          setError("Wrong passphrase. Could not decrypt your existing document.");
          setLoading(false);
          return;
        }
      }

      onUnlocked();
    } catch (err) {
      console.error("Key derivation error:", err);
      setError("Failed to derive encryption key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passphrase-modal-overlay">
      <div className="passphrase-modal">
        <h2>Unlock encryption</h2>
        <p>Enter your shared passphrase to encrypt and decrypt your shared document.</p>

        {!existingDoc && (
          <p className="hint">
            Make sure your partner uses the same passphrase.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Shared passphrase"
            autoFocus
            disabled={loading}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading || !passphrase.trim()}>
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
