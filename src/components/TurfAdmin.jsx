import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /* ================= FETCH TURFS ================= */
  const fetchTurfs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/turfs/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("ADMIN TURFS:", data);

      setTurfs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const turf = turfs.length > 0 ? turfs[0] : null;

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= CREATE TURF ================= */
  const createTurf = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/turfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, price }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Turf created!");

    setName("");
    setLocation("");
    setPrice("");

    fetchTurfs();
  };

  /* ================= ADD SLOT ================= */
  const addSlot = async () => {
    const token = localStorage.getItem("token");

    if (!turf) return alert("Create a turf first");
    if (!startTime || !endTime) return alert("Enter time");

    const res = await fetch(
      `http://localhost:5000/api/turfs/${turf._id}/slots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day, startTime, endTime }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setStartTime("");
    setEndTime("");

    fetchTurfs();
  };

  /* ================= DELETE SLOT ================= */
  const deleteSlot = async (index) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/turfs/${turf._id}/slots/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchTurfs();
  };

  /* ================= UI ================= */
  return (
    <div className="page">

      <div className="navbar">
        <h2 className="title">🏟 Turf Admin</h2>

        {/* FIXED SMALL LOGOUT BUTTON */}
        <button
          className="logoutBtn"
          style={{ padding: "6px 10px", fontSize: "12px" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="grid">

        {/* CREATE TURF */}
        <div className="panel">
          <h3>Create Turf</h3>

          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Turf Name" />
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
          <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

          <button className="primary" onClick={createTurf}>
            Create Turf
          </button>
        </div>

        {/* ADD SLOT */}
        <div className="panel">
          <h3>Add Slots</h3>

          <div className="slotRow">
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>

            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button onClick={addSlot}>Add</button>
          </div>

          <h3>Slots</h3>

          {!turf?.slots?.length ? (
            <p>No slots</p>
          ) : (
            turf.slots.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span>{s.day} | {s.startTime} - {s.endTime}</span>

                {/* FIXED SMALL DELETE BUTTON */}
                <button
                  onClick={() => deleteSlot(i)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    borderRadius: "6px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}