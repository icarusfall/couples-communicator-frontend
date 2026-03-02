import { Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <span className="app-name">Couples Communicator</span>
        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
