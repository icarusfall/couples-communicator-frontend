import { useEffect, useState } from "react";
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
      <p className="hint">More features coming soon.</p>
    </div>
  );
}
