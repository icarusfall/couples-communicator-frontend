import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <Link to="/" className="public-header-brand">
          Build A Bridge
        </Link>
        <nav className="public-nav">
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/ethics">Ethics</Link>
          <Link to="/login">Log In</Link>
          <Link to="/register" className="public-nav-cta">
            Get Started
          </Link>
        </nav>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div>A communication tool for couples. Not therapy.</div>
        <div className="public-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/ethics">Ethics</Link>
          <Link to="/login">Sign In</Link>
        </div>
        <div className="public-footer-contact">
          Questions or issues? Email <a href="mailto:help@buildabridge.app">help@buildabridge.app</a>
        </div>
      </footer>
    </div>
  );
}
