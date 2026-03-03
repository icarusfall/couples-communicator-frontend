import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { ApiError } from "../api";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(email, password, pseudonym);
      navigate("/pairing");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-to-home">&larr; Back to home</Link>
      <h1>Register</h1>
      <div className="disclaimer">
        <p><strong>This is not therapy.</strong> This tool uses AI to help you reflect on communication with your partner. It may make mistakes and is not a substitute for professional support.</p>
        <p>If you or someone you know is experiencing domestic abuse, contact the <a href="https://www.nationaldahelpline.org.uk/" target="_blank" rel="noopener noreferrer">National Domestic Abuse Helpline</a>: <strong>0808 2000 247</strong> (free, 24/7).</p>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label>
          Pseudonym
          <input
            type="text"
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            required
            maxLength={50}
            placeholder="A name your partner will recognise"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="auth-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
