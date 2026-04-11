import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u && u !== "undefined" ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // 🔥 REAL-TIME WATCH (RESTORES YOUR OLD SYSTEM)
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");

      let newUser = null;
      try {
        const u = localStorage.getItem("user");
        newUser = u && u !== "undefined" ? JSON.parse(u) : null;
      } catch {
        newUser = null;
      }

      setToken(newToken);
      setUser(newUser);
    }, 300); // faster reaction = instant logout

    return () => clearInterval(interval);
  }, []);

  // ❌ INVALID TOKEN = LOGOUT IMMEDIATELY
  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.length < 10 ||
    !user
  ) {
    return <Navigate to="/login" />;
  }

  // ❌ ROLE CHECK
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "customer") return <Navigate to="/restaurants" />;
    return <Navigate to="/" />;
  }

  // ✅ ALLOW ACCESS
  return children;
}