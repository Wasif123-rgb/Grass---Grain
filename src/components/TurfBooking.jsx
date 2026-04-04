import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfBooking.css";

export default function TurfBooking() {
  const [turfs, setTurfs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setTurfs(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleBook = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/turfs/book/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Booking failed");
      alert("Turf booked successfully");
      fetchTurfs();
    } catch (err) {
      console.error("BOOK ERROR:", err);
      alert("Failed to book turf");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="turf-booking-page">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h2>Available Turfs</h2>
      <ul className="turf-list">
        {turfs.map((turf) => (
          <li key={turf._id}>
            {turf.name} - {turf.location} - ${turf.price}{" "}
            <button onClick={() => handleBook(turf._id)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
}