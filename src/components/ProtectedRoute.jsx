import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Role required but user role doesn't match
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}