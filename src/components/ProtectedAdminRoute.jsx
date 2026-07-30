// src/components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Route guard for admin-only pages. Unauthenticated visitors are sent to the
 * admin login, authenticated non-admins to the farmer dashboard.
 * @param {{ children: React.ReactNode }} props
 */
export function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
