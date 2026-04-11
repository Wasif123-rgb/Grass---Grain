import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "demo-user";

    fetch(`http://localhost:5000/api/turfs/my-bookings/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="my-page">

      <div className="my-header">
        <h1>📌 My Bookings</h1>

      </div>

      <div className="my-grid">

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((b, i) => (
            <div key={i} className="my-card">

              <h3>{b.turfName}</h3>
              <p>{b.location}</p>

              <div className="slot">
                {b.day} | {b.time}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}