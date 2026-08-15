// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');

  // ─────────────────────────────────────────────
  // Adjust this condition if your backend only requires
  // one of the two (e.g. token alone is enough).
  // ─────────────────────────────────────────────
  const isAuthenticated = !!token && !!refreshToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
