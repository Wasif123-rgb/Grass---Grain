import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/restaurants" />;
  }

  return children;
}