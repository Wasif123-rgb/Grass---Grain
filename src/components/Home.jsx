import { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-card");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <h2 className="logo">Grass & Grain</h2>

        {/* Hamburger */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/restaurants"
            onClick={() => setMenuOpen(false)}
          >
            Restaurants
          </Link>

          <a
            href="#"
            onClick={() => setMenuOpen(false)}
          >
            Turf
          </a>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
           >
            Contact
           </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Grass & Grain</h1>
          <p>Where Matches Meet Meals.</p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/restaurants")}
            >
              Find Restaurants
            </button>

            <button className="secondary-btn">
              Book Turf
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
        <div className="card">
          🍴
          <h3>Restaurant Booking</h3>
          <p>Reserve your favorite restaurants.</p>
        </div>

        <div className="card">
          ⚽
          <h3>Turf Reservation</h3>
          <p>Book turf easily.</p>
        </div>

        <div className="card">
          📱
          <h3>Online Access</h3>
          <p>Manage bookings online.</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        © 2026 Grass & Grain
      </footer>
    </>
  );
}