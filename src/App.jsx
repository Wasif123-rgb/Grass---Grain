import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Restaurants from "./components/restaurants";
import RestaurantDetail from "./components/RestaurantDetail";
import AdminDashboard from "./components/AdminDashboard";
import TurfBooking from "./components/TurfBooking";
import TurfAdmin from "./components/TurfAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminOrders from "./components/AdminOrders";
import MyOrders from "./components/MyOrders";
import Bookings from "./components/Bookings";
import MyBookings from "./components/MyBookings";
export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* CUSTOMER */}
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Restaurants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <RestaurantDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-turf"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <TurfBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turf-admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TurfAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* REDIRECT */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}