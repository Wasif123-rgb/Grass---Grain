import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const [turfs, setTurfs] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTurfs = async () => {
    const res = await fetch("http://localhost:5000/api/turfs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTurfs(data);
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const addSlot = () => {
    if (!startTime || !endTime) return;
    setSlots([...slots, { day, startTime, endTime }]);
    setStartTime("");
    setEndTime("");
  };

  const addTurf = async () => {
    await fetch("http://localhost:5000/api/turfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, price, slots }),
    });

    setName("");
    setLocation("");
    setPrice("");
    setSlots([]);

    fetchTurfs();
  };

  return (
    <div className="page">

      {/* TOP BAR */}
      <div className="topbar">
        <div className="logo">🏟 Turf Admin Panel</div>

        <button className="logout" onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
          }}>
        Logout
        </button>
      </div>

      <div className="container">

        {/* LEFT FORM */}
        <div className="panel">
          <h2>Create Turf</h2>

          <input placeholder="Turf Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

          <hr />

          <h4>Add Slots</h4>

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

            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button onClick={addSlot}>+</button>
          </div>

          <div className="chips">
            {slots.map((s, i) => (
              <span key={i}>
                {s.day} {s.startTime}-{s.endTime}
              </span>
            ))}
          </div>

          <button className="primary" onClick={addTurf}>
            Publish Turf
          </button>
        </div>

        {/* RIGHT LIST */}
        <div className="panel">
          <h2>My Turfs</h2>

          {turfs.length === 0 ? (
            <p>No turfs found</p>
          ) : (
            turfs.map((t) => (
              <div className="card" key={t._id}>
                <h3>{t.name}</h3>
                <p>{t.location}</p>
                <p>৳ {t.price}</p>

                <div className="slots">
                  {t.slots?.map((s, i) => (
                    <div key={i}>
                      {s.day} • {s.startTime} - {s.endTime}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}