import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfBooking.css";

export default function TurfBooking() {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/turfs/all")
      .then((res) => res.json())
      .then((data) => setTurfs(Array.isArray(data) ? data : []))
      .catch(() => setTurfs([]));
  }, []);

  const bookSlot = async (turfId, index) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const res = await fetch(
      `http://localhost:5000/api/turfs/book/${turfId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slotIndex: index }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    window.location.reload();
  };

  return (
    <div className="turf-page">

      {/* HEADER */}
      <div className="turf-header">
        <h1>🏟 Turf Booking</h1>

        <button
          className="turf-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="turf-grid">

        {turfs.map((turf) => (
          <div key={turf._id} className="turf-card">

            <div className="turf-card-header">
              <h3>{turf.name}</h3>
              <span className="turf-price">₹ {turf.price}</span>
            </div>

            <p className="turf-location">{turf.location}</p>

            <div className="turf-slots">

              {turf.slots?.map((s, i) => (
                <div key={i} className="turf-slot">

                  <span>
                    {s.day} • {s.startTime}-{s.endTime}
                  </span>

                  <button
                    disabled={s.isBooked}
                    onClick={() => bookSlot(turf._id, i)}
                    className={
                      s.isBooked ? "turf-booked" : "turf-book"
                    }
                  >
                    {s.isBooked ? "Booked" : "Book"}
                  </button>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}