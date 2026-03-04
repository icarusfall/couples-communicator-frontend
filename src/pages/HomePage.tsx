import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { apiFetch } from "../api";

interface CoupleStatus {
  paired: boolean;
  coupleId?: string;
  partnerPseudonym?: string | null;
  waitingForPartner?: boolean;
  pairingCode?: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CoupleStatus>("/couple/status")
      .then((data) => {
        if (data.partnerPseudonym) {
          setPartnerName(data.partnerPseudonym);
        }
        if (data.waitingForPartner && data.pairingCode) {
          setPairingCode(data.pairingCode);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-center">
      <h2>Welcome, {user?.pseudonym}!</h2>
      {pairingCode && (
        <div className="pairing-banner">
          <p>Your partner hasn't joined yet. Share this code: <strong className="pairing-code-inline">{pairingCode}</strong></p>
          <p className="hint">The code expires in 7 days — if it lapses, you can generate a new one. You can start chatting in the meantime.</p>
        </div>
      )}
      {partnerName && <p>Paired with <strong>{partnerName}</strong>.</p>}
      <Link to="/chat">
        <button style={{ marginTop: 20 }}>Start a chat session</button>
      </Link>
      <div className="info-card">
        <h3>Before you begin</h3>
        <ul>
          <li><strong>This is not therapy.</strong> It's an AI communication coach to help you reflect — not a replacement for professional counselling.</li>
          <li><strong>AI has limitations.</strong> The bot may misunderstand context or make mistakes. Use your own judgement.</li>
          <li><strong>Your data is encrypted.</strong> Shared documents are encrypted with a passphrase only you and your partner know. Conversation history is stored locally on your device.</li>
        </ul>
        <p className="info-card-resources">
          If you or someone you know is experiencing domestic abuse:<br />
          <a href="https://www.nationaldahelpline.org.uk/" target="_blank" rel="noopener noreferrer">National Domestic Abuse Helpline</a>: <strong>0808 2000 247</strong> (free, 24/7)<br />
          <a href="https://www.refuge.org.uk/" target="_blank" rel="noopener noreferrer">Refuge</a> — support for women and children
        </p>
      </div>
      <Link to="/account" className="account-link">Account settings</Link>
    </div>
  );
}
