import { Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export default function Layout() {
  const { logout } = useAuth();

  const quickExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <span className="app-name">Build A Bridge</span>
        <div className="header-actions">
          <button className="quick-exit-btn" onClick={quickExit}>
            Exit
          </button>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
