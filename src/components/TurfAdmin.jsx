import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./turfAdmin.css";

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

    if (!selectedTurf && data.length > 0) {
      setSelectedTurf(data[0]);
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

    setName("");
    setLocation("");
    setPrice("");
    fetchTurfs();
  };

  const addSlot = async () => {
    if (!selectedTurf) return;

    await fetch(
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

    setStartTime("");
    setEndTime("");
    fetchTurfs();
  };

  const deleteSlot = async (index) => {
    await fetch(
      `http://localhost:5000/api/turfs/${selectedTurf._id}/slots/${index}`,
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
        <h2>🏟 Turf Admin</h2>

        <div className="nav-right">
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">

        {/* LEFT */}
        <div className="panel">
          <h3>Create Turf</h3>

          <input
            placeholder="Turf Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button onClick={createTurf}>Create Turf</button>

          <hr />

          <h3>Select Turf</h3>

          <select
            onChange={(e) =>
              setSelectedTurf(
                turfs.find((t) => t._id === e.target.value)
              )
            }
          >
            {turfs.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT */}
        <div className="panel">

          <h3>Add Slots</h3>

          <div className="slot-row">
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

            <button onClick={addSlot}>Add</button>
          </div>

          <h3 style={{ marginTop: "20px" }}>Slots</h3>

          {!selectedTurf || selectedTurf.slots.length === 0 ? (
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
                      <button onClick={() => deleteSlot(i)}>
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