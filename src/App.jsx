import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Restaurants from "./components/restaurants";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===============================
   Wrapper for Back Navigation
================================ */

function RestaurantsWrapper() {
  const navigate = useNavigate();

  return <Restaurants onBack={() => navigate("/")} />;
}

export default function App() {

  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Route */}
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <RestaurantsWrapper />
          </ProtectedRoute>
        }
      />

      {/* Redirect Unknown Pages */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}