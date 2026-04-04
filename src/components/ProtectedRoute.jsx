import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // If not logged in
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is defined and user role is not included
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "customer") return <Navigate to="/restaurants" />;
    return <Navigate to="/" />;
  }

  return children;
}