import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [activeTurf, setActiveTurf] = useState(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /* ================= FETCH TURFS ================= */
  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs/all");
      const data = await res.json();

      const safeData = Array.isArray(data) ? data : [];
      setTurfs(safeData);

      if (safeData.length > 0) {
        setActiveTurf(safeData[0]);
      } else {
        setActiveTurf(null);
      }
    } catch (err) {
      console.log(err);
      setTurfs([]);
      setActiveTurf(null);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  /* ================= CREATE TURF ================= */
  const createTurf = async () => {
    if (!name || !location || !price) {
      return alert("Fill all fields");
    }

    const res = await fetch("http://localhost:5000/api/turfs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, price }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message);
    }

    alert("Turf created!");

    fetchTurfs();
  };

  /* ================= ADD SLOT ================= */
  const addSlot = async () => {
    if (!activeTurf) return alert("Create turf first");
    if (!startTime || !endTime) return alert("Enter time");

    const duplicate = activeTurf.slots?.some(
      (s) =>
        s.day === day &&
        s.startTime === startTime &&
        s.endTime === endTime
    );

    if (duplicate) {
      return alert("Slot already exists ❌");
    }

    const res = await fetch(
      `http://localhost:5000/api/turfs/${activeTurf._id}/slots`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, startTime, endTime }),
      }
    );

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    setStartTime("");
    setEndTime("");

    fetchTurfs();
  };

  /* ================= DELETE SLOT ================= */
  const deleteSlot = async (index) => {
    await fetch(
      `http://localhost:5000/api/turfs/${activeTurf._id}/slots/${index}`,
      {
        method: "DELETE",
      }
    );

    fetchTurfs();
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="page">

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="title">🏟 Turf Admin</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>

          <button
            onClick={() => navigate("/bookings")}
            style={{
              background: "#111",
              color: "white",
              border: "none",
              padding: "6px 10px",
              fontSize: "12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Bookings
          </button>

          <button className="logoutBtn" onClick={logout}>
            Logout
          </button>

        </div>
      </div>

      {/* GRID */}
      <div className="grid">

        {/* CREATE TURF */}
        <div className="panel">
          <h3>Create Turf</h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

          <button onClick={createTurf} className="primary">
            Create Turf
          </button>
        </div>

        {/* ADD SLOT */}
        <div className="panel">
          <h3>Add Slot</h3>

          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button onClick={addSlot}>Add Slot</button>

          <h3>Slots</h3>

          {!activeTurf?.slots?.length ? (
            <p>No slots</p>
          ) : (
            activeTurf.slots.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "10px" }}>
                <span>
                  {s.day} | {s.startTime} - {s.endTime}
                </span>

                <button onClick={() => deleteSlot(i)}>Delete</button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}