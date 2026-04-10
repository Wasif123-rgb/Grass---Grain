import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchTurfs = async () => {
    const res = await fetch("http://localhost:5000/api/turfs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTurfs(data);

    if (data.length > 0) {
      if (selectedTurf) {
        const updated = data.find((t) => t._id === selectedTurf._id);
        setSelectedTurf(updated);
      } else {
        setSelectedTurf(data[0]);
      }
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const createTurf = async () => {
    await fetch("http://localhost:5000/api/turfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, price }),
    });

    fetchTurfs();
  };

  const addSlot = async () => {
    if (!selectedTurf) return;

    const res = await fetch(
      `http://localhost:5000/api/turfs/${selectedTurf._id}/slots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day, startTime, endTime }),
      }
    );

    const updated = await res.json();
    setSelectedTurf(updated);
    fetchTurfs();

    setStartTime("");
    setEndTime("");
  };

  const deleteSlot = async (index) => {
    const res = await fetch(
      `http://localhost:5000/api/turfs/${selectedTurf._id}/slots/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const updated = await res.json();
    setSelectedTurf(updated);
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

        {/* LEFT PANEL */}
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

          <hr />

          <h3>Select Turf</h3>

          <select
            className="select"
            onChange={(e) =>
              setSelectedTurf(turfs.find((t) => t._id === e.target.value))
            }
          >
            {turfs.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT PANEL */}
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

          {!selectedTurf ||
          !selectedTurf.slots ||
          selectedTurf.slots.length === 0 ? (
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
                {selectedTurf.slots.map((s, i) => (
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