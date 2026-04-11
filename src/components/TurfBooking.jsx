import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfBooking.css";

export default function TurfBooking() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH TURFS ================= */
  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs/all");

      const data = await res.json();

      setTurfs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching turfs:", err);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  /* ================= BOOK SLOT ================= */
  const handleBook = async (turfId, index) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
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

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Booked successfully!");
        fetchTurfs();
      }
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="bookingPage">

      {/* TOP BAR */}
      <div className="topBar">
        <h2>Available Turfs</h2>

        <button
          className="logoutBtn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="grid">

        {loading ? (
          <p>Loading...</p>
        ) : turfs.length === 0 ? (
          <p>No turfs found</p>
        ) : (
          turfs.map((turf) => (
            <div key={turf._id} className="card">
              <h3>{turf.name}</h3>
              <p>{turf.location}</p>
              <p>₹ {turf.price}</p>

              <div className="slots">
                {turf.slots?.length > 0 ? (
                  turf.slots.map((s, i) => (
                    <div key={i} className="slotBox">
                      <span>
                        {s.day} | {s.startTime} - {s.endTime}
                      </span>

                      {s.isBooked ? (
                        <button disabled className="bookedBtn">
                          Booked
                        </button>
                      ) : (
                        <button
                          className="bookBtn"
                          onClick={() => handleBook(turf._id, i)}
                        >
                          Book
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No slots available</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}