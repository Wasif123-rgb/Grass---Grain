import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfAdmin.css";

export default function TurfAdmin() {
  const [turfs, setTurfs] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTurfs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setTurfs(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/turfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, price }),
      });
      if (!res.ok) throw new Error("Add failed");
      setName(""); setLocation(""); setPrice(0);
      fetchTurfs();
    } catch (err) {
      console.error("ADD ERROR:", err);
      alert("Failed to add turf");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="turf-admin-page">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h2>Turf Admin Dashboard</h2>

      <div className="add-turf-form">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Turf Name" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" />
        <button onClick={handleAdd}>Add Turf</button>
      </div>

      <h3>All Turfs</h3>
      <ul className="turf-list">
        {turfs.map((turf) => (
          <li key={turf._id}>
            {turf.name} - {turf.location} - ${turf.price}
          </li>
        ))}
      </ul>
    </div>
  );
}