import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch, ApiError } from "../api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="auth-page">
        <Link to="/" className="back-to-home">&larr; Back to home</Link>
        <h1>Invalid Link</h1>
        <p>This password reset link is invalid. Please request a new one.</p>
        <p className="auth-link">
          <Link to="/forgot-password">Request new reset link</Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      setSuccess(true);
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

  if (success) {
    return (
      <div className="auth-page">
        <Link to="/" className="back-to-home">&larr; Back to home</Link>
        <h1>Password Reset</h1>
        <p>Your password has been reset successfully.</p>
        <p className="auth-link">
          <Link to="/login">Log in with your new password</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Link to="/" className="back-to-home">&larr; Back to home</Link>
      <h1>Set New Password</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label>
          New Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      <p className="auth-link">
        <Link to="/forgot-password">Request a new reset link</Link>
      </p>
    </div>
  );
}
