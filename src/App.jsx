import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Restaurants from "./components/restaurants";
import AdminDashboard from "./components/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/About";
import Contact from "./components/Contact";

export default function App() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ================= CUSTOMER ================= */}
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <Restaurants />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= REDIRECT ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}