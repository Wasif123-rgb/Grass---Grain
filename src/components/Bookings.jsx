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

  const cancelBooking = async (turfId, slotIndex) => {
    const res = await fetch(
      `http://localhost:5000/api/turfs/admin/cancel/${turfId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotIndex }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setBookings((prev) =>
      prev.filter((b) => !(b.turfId === turfId && b.slotIndex === slotIndex))
    );
  };

  return (
    <div className="booking-page">

      {/* HEADER */}
      <div className="booking-header">
        <h1>📋 Bookings Dashboard</h1>

        
      </div>

      {/* GRID */}
      <div className="booking-grid">

        {bookings.length === 0 ? (
          <p>No bookings found</p>
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

              <button
                className="cancel-btn"
                onClick={() => cancelBooking(b.turfId, b.slotIndex)}
              >
                Cancel Booking
              </button>

            </div>
          ))
        )}

      </div>
    </div>
  );
}