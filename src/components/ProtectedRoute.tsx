import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) return <div className="page-center"><p>Loading...</p></div>;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}
