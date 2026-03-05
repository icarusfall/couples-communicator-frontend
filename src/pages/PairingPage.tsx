import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../api";

interface CoupleStatus {
  paired: boolean;
  coupleId?: string;
  partnerPseudonym?: string | null;
  waitingForPartner?: boolean;
}

interface CreateCoupleResponse {
  coupleId: string;
  pairingCode: string;
  expiresAt: string;
}

interface JoinCoupleResponse {
  coupleId: string;
  partnerPseudonym: string | null;
}

export default function PairingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CoupleStatus | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await apiFetch<CoupleStatus>("/couple/status");
      setStatus(data);
      if (data.paired && !data.waitingForPartner) {
        navigate("/home");
      }
    } catch {
      setError("Failed to load pairing status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCreate = async () => {
    setError("");
    setSubmitting(true);
    try {
      await apiFetch<CreateCoupleResponse>("/couple/create", {
        method: "POST",
      });
      navigate("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create couple.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await apiFetch<JoinCoupleResponse>("/couple/join", {
        method: "POST",
        body: JSON.stringify({ pairingCode: joinCode.trim() }),
      });
      navigate("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to join couple.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-center"><p>Loading...</p></div>;

  // Waiting for partner — redirect to home (they can chat while waiting)
  if (status?.waitingForPartner) {
    navigate("/home");
    return null;
  }

  // Not in a couple yet
  return (
    <div className="page-center">
      <h2>Couple Pairing</h2>
      {error && <p className="error">{error}</p>}

      <div className="pairing-section">
        <h3>Start a new couple</h3>
        <p>Create a couple and get a pairing code to share with your partner.</p>
        <button onClick={handleCreate} disabled={submitting}>
          {submitting ? "Creating..." : "Create a couple"}
        </button>
      </div>

      <div className="divider">or</div>

      <div className="pairing-section">
        <h3>Join your partner</h3>
        <p>Enter the pairing code your partner shared with you.</p>
        <div className="inline-form">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            maxLength={8}
          />
          <button onClick={handleJoin} disabled={submitting || !joinCode.trim()}>
            {submitting ? "Joining..." : "Join"}
          </button>
        </div>
      </div>

      <div className="divider">or</div>

      <div className="pairing-section">
        <p>Just want to explore first? You can set up partner linking later.</p>
        <button onClick={() => navigate("/home")} className="button-secondary">
          Skip for now and start chatting
        </button>
      </div>
    </div>
  );
}
