import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfBooking.css";

export default function TurfBooking() {
  const [turfs, setTurfs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTurfs(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleBook = async (turfId, index) => {
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
    } catch {
      alert("Booking failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bookingPage">

      <div className="topBar">
        <h2>Available Turfs</h2>
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid">

        {turfs.length === 0 ? (
          <p>No turfs found</p>
        ) : (
          turfs.map((turf) => (
            <div key={turf._id} className="card">

              <h3>{turf.name}</h3>
              <p>{turf.location}</p>
              <p>₹ {turf.price}</p>

              <div className="slots">
                {turf.slots?.map((s, i) => (
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
                ))}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}