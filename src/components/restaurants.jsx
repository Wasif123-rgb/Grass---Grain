import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/reviews/avg/all")
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(r => {
          map[r._id] = { avg: r.avgRating, count: r.count };
        });
        setRatingsMap(map);
      })
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToRestaurant = (r) => {
    navigate(`/restaurants/${r._id}`);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(empty);
  };

  return (
    <div className="restaurants-page">
      {/* Header */}
      <div className="page-header">
        <h1>🍽 Premium Restaurants</h1>
        <div className="header-buttons">
          <button className="small-btn" onClick={() => navigate("/my-orders")}>My Orders</button>
          <button className="small-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="restaurant-grid">
        {restaurants.map(r => {
          const ratingData = ratingsMap[r._id];
          return (
            <div key={r._id} className="restaurant-card" onClick={() => goToRestaurant(r)}>
              <div className="card-info">
                <h3>{r.name}</h3>
                <p>{r.location}</p>
                <div className="rating">
                  {ratingData ? (
                    <>
                      <span className="stars">{renderStars(ratingData.avg)}</span>
                      <span className="rating-text">{ratingData.avg.toFixed(1)} ({ratingData.count})</span>
                    </>
                  ) : (
                    <span className="no-rating">No ratings</span>
                  )}
                </div>
                <span>{r.foods?.length || 0} items</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}