import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  });

  // Poll localStorage every 500ms to detect changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");

      const storedUser = localStorage.getItem("user");
      const newUser =
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null;

      if (newToken !== token) setToken(newToken);
      if (JSON.stringify(newUser) !== JSON.stringify(user)) setUser(newUser);
    }, 500);

    return () => clearInterval(interval);
  }, [token, user]);

  // If token is missing or clearly invalid, log out
  if (
    !token || 
    !user || 
    token === "null" || 
    token === "undefined" || 
    token.length < 10 // optional: catch very short fake tokens like "jjj"
  ) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is defined and user role is not included
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "customer") return <Navigate to="/restaurants" />;
    return <Navigate to="/" />;
  }

  // Everything is fine → render children
  return children;
}