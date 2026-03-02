import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { apiFetch } from "../api";

interface CoupleStatus {
  paired: boolean;
  coupleId?: string;
  partnerPseudonym?: string | null;
  waitingForPartner?: boolean;
}

export default function HomePage() {
  const { user } = useAuth();
  const [partnerName, setPartnerName] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CoupleStatus>("/couple/status")
      .then((data) => {
        if (data.partnerPseudonym) {
          setPartnerName(data.partnerPseudonym);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-center">
      <h2>Welcome, {user?.pseudonym}!</h2>
      {partnerName && <p>Paired with <strong>{partnerName}</strong>.</p>}
      <Link to="/chat">
        <button style={{ marginTop: 20 }}>Start a chat session</button>
      </Link>
    </div>
  );
}
