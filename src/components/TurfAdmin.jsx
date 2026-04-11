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

  /* ================= FETCH ================= */
  const fetchTurfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const res = await fetch("http://localhost:5000/api/turfs/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setTurfs(Array.isArray(data) ? data : []);

    if (data.length > 0) {
      setActiveTurf(data[0]);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  /* ================= CREATE TURF (NO CLEAR INPUTS) ================= */
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

    fetchTurfs();
  };

  /* ================= ADD SLOT (NO DUPLICATE) ================= */
  const addSlot = async () => {
    if (!activeTurf) return alert("Create turf first");
    if (!startTime || !endTime) return alert("Enter time");

    // ❌ prevent duplicate slot
    const duplicate = activeTurf.slots?.some(
      (s) =>
        s.day === day &&
        s.startTime === startTime &&
        s.endTime === endTime
    );

    if (duplicate) {
      return alert("Slot already exists ❌");
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/turfs/${activeTurf._id}/slots`,
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

    if (!res.ok) return alert(data.message);

    setStartTime("");
    setEndTime("");

    fetchTurfs();
  };

  /* ================= DELETE SLOT ================= */
  const deleteSlot = async (index) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/turfs/${activeTurf._id}/slots/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

      <div className="navbar">
        <h2>🏟 Turf Admin</h2>

        <button className="logoutBtn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid">

        {/* CREATE TURF */}
        <div className="panel">
          <h3>Create Turf</h3>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

          <button onClick={createTurf}>Create</button>
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

          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

          <button onClick={addSlot}>Add Slot</button>

          <h3>Slots</h3>

          {!activeTurf?.slots?.length ? (
            <p>No slots</p>
          ) : (
            activeTurf.slots.map((s, i) => (
              <div key={i}>
                {s.day} | {s.startTime} - {s.endTime}

                <button onClick={() => deleteSlot(i)}>
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