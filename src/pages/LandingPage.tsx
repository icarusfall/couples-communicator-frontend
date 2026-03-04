import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <div className="landing-hero">
        <h1>Talking about difficult things is hard</h1>
        <p>
          This tool helps you and your partner find the words. Each of you chats
          privately with an AI communication coach, then shares what you're
          comfortable with through an encrypted shared document.
        </p>
        <Link to="/register" className="landing-cta">
          Get Started
        </Link>
      </div>

      <div className="beta-notice">
        <strong>Early access</strong> — This project is in beta. Use of the AI
        coach is currently free, but we'll need to cap the number of users and
        may introduce a small charge once we reach capacity.
      </div>

      <div className="landing-cards">
        <div className="landing-card">
          <h3>Private conversations</h3>
          <p>
            Each partner has their own private space to think out loud, explore
            feelings, and find the right words — without pressure.
          </p>
        </div>
        <div className="landing-card">
          <h3>Shared documents</h3>
          <p>
            When you're ready, share a summary of what matters to you. Your
            partner sees only what you choose to share, nothing more.
          </p>
        </div>
        <div className="landing-card">
          <h3>Not therapy</h3>
          <p>
            This is a communication tool, not a clinical service. The AI helps
            you reflect and articulate — it doesn't diagnose or prescribe.
          </p>
        </div>
        <div className="landing-card">
          <h3>Your data is yours</h3>
          <p>
            Conversations are encrypted on your device. Shared documents are
            encrypted end-to-end. We can't read any of it, even if we wanted to.
          </p>
        </div>
      </div>

      <div className="landing-callout">
        <h3>Partner sent you a code?</h3>
        <p>
          If your partner has already set things up and shared a pairing code
          with you, create an account and enter the code to connect.
        </p>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
