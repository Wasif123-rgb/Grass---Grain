import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [turfs, setTurfs] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // FETCH TURF
  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs", {
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

  const turf = turfs?.[0] || null;

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // CREATE TURF
  const createTurf = async () => {
    await fetch("http://localhost:5000/api/turfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, price }),
    });

    setName("");
    setLocation("");
    setPrice("");

    fetchTurfs();
  };

  // ADD SLOT
  const addSlot = async () => {
    if (!turf) return;

    await fetch(`http://localhost:5000/api/turfs/${turf._id}/slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ day, startTime, endTime }),
    });

    setStartTime("");
    setEndTime("");

    fetchTurfs();
  };

  // DELETE SLOT
  const deleteSlot = async (index) => {
    if (!turf) return;

    await fetch(
      `http://localhost:5000/api/turfs/${turf._id}/slots/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchTurfs();
  };

  return (
    <div className="page">

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="title">🏟 Turf Admin</h2>

        <div className="navRight">
          <button className="logoutBtn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="grid">

        {/* LEFT */}
        <div className="panel">
          <h3>Create Turf</h3>

          <input
            className="input"
            placeholder="Turf Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="input"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="primary" onClick={createTurf}>
            Create Turf
          </button>
        </div>

        {/* RIGHT */}
        <div className="panel">

          <h3>Add Slots</h3>

          <div className="slotRow">

            <select
              className="select"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>

            <input
              className="input"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              className="input"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <button className="primary" onClick={addSlot}>
              Add
            </button>

          </div>

          <h3 style={{ marginTop: "20px" }}>Slots</h3>

          {!turf?.slots?.length ? (
            <p className="empty">No slots added</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {turf.slots.map((s, i) => (
                  <tr key={i}>
                    <td>{s.day}</td>
                    <td>{s.startTime} - {s.endTime}</td>
                    <td>
                      <button className="danger" onClick={() => deleteSlot(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </div>
    </div>
  );
}