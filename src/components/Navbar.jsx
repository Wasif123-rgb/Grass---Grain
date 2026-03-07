import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "10px", background: "#2e7d32", color: "white" }}>
      <Link to="/" style={{ color: "white" }}>Home</Link>
      <Link to="/about" style={{ color: "white" }}>About</Link>
      <Link to="/contact" style={{ color: "white" }}>Contact</Link>
      <Link to="/login" style={{ color: "white" }}>Login</Link>
    </nav>
  );
}