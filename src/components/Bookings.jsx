import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/turfs/admin/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div className="booking-page">

      {/* HEADER */}
      <div className="booking-header">
        <h1>📋 Bookings Dashboard</h1>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="booking-grid">

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookings.map((b, i) => (
            <div key={i} className="booking-card">

              <h3>{b.turfName}</h3>
              <p>{b.location}</p>

              <div className="slot">
                <span>{b.day}</span>
                <span>{b.time}</span>
              </div>

              <div className="booked-by">
                👤 {b.bookedBy}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}