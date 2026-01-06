import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../store/auth";
import { useAppSelector } from "../store/store";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}