import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cartMap, setCartMap] = useState({});
  const [ratingsMap, setRatingsMap] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ================= FETCH RESTAURANTS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  // ================= FETCH AVG RATINGS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/reviews/avg/all")
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(r => {
          map[r._id] = {
            avg: r.avgRating,
            count: r.count
          };
        });
        setRatingsMap(map);
      })
      .catch(err => console.error(err));
  }, []);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    if (selected) {
      fetch(`http://localhost:5000/api/reviews/${selected._id}`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.error(err));
    }
  }, [selected]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= CART =================
  const addToCart = (food) => {
    setCartMap(prev => {
      const restId = selected._id;
      const prevCart = prev[restId] || [];
      const exists = prevCart.find(i => i.name === food.name);

      const newCart = exists
        ? prevCart.map(i =>
            i.name === food.name ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prevCart, { ...food, quantity: 1 }];

      return { ...prev, [restId]: newCart };
    });
  };

  const removeFromCart = (name) => {
    setCartMap(prev => {
      const restId = selected._id;
      const newCart = (prev[restId] || []).filter(i => i.name !== name);
      return { ...prev, [restId]: newCart };
    });
  };

  // ================= CHECKOUT =================
  const checkout = async () => {
    const cart = cartMap[selected._id] || [];
    if (cart.length === 0) return alert("Cart empty");

    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount,
          restaurantId: selected._id
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed ✅");
        setCartMap(prev => ({ ...prev, [selected._id]: [] }));
      } else {
        alert("Order failed ❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ================= SUBMIT REVIEW =================
  const submitReview = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId: selected._id,
          rating,
          comment
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review added ✅");
        setComment("");
        setRating(5);

        const updated = await fetch(`http://localhost:5000/api/reviews/${selected._id}`);
        setReviews(await updated.json());
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= STAR RENDER =================
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(empty);
  };

  // ================= SELECTED RESTAURANT =================
  if (selected) {
    const cart = cartMap[selected._id] || [];

    return (
      <div className="restaurants-page">
        <div className="restaurant-header">
          <div className="header-left">
            <h2>{selected.name}</h2>
            <p>{selected.location}</p>
          </div>

          <div className="header-right">
            <button className="small-btn" onClick={() => setSelected(null)}>Back</button>
            <button className="small-btn" onClick={() => navigate("/my-orders")}>My Orders</button>
            <button className="small-btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* MENU */}
        <div className="menu-grid">
          {selected.foods?.map((food, i) => (
            <div key={i} className="menu-card">
              <h3>{food.name}</h3>
              <p>৳ {food.price}</p>
              <button onClick={() => addToCart(food)}>Add</button>
            </div>
          ))}
        </div>

        {/* CART */}
        <div className="cart-box">
          <h3>🛒 Cart</h3>
          {cart.length === 0 ? (
            <p className="empty-text">Cart empty</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <span>{item.name} x {item.quantity}</span>
                  <button onClick={() => removeFromCart(item.name)}>✕</button>
                </div>
              ))}
              <p>Total: ৳ {cart.reduce((s, i) => s + i.price * i.quantity, 0)}</p>
              <button className="checkout-btn" onClick={checkout}>Checkout</button>
            </>
          )}
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="review-box">
          <h3>⭐ Reviews</h3>

          {/* SUBMIT REVIEW */}
          <div className="review-form">
            <div className="interactive-stars">
              {[1,2,3,4,5].map((n, i) => {
                const starClass = rating >= n ? "full" : rating >= n - 0.5 ? "half" : "empty";
                return (
                  <span
                    key={i}
                    className={`star ${starClass}`}
                    onClick={() => setRating(n)}
                    style={{ cursor: "pointer", fontSize: "18px", marginRight: "2px" }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={submitReview}>Submit</button>
          </div>

          {/* DISPLAY REVIEWS */}
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{r.customerName}</strong>
                  <span className="stars">{renderStars(r.rating)}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ================= ALL RESTAURANTS =================
  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1>🍽 Restaurants</h1>
        <button className="small-btn logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="restaurant-grid">
        {restaurants.map(r => {
          const ratingData = ratingsMap[r._id];

          return (
            <div key={r._id} className="restaurant-card" onClick={() => setSelected(r)}>
              <h3>{r.name}</h3>
              <p>{r.location}</p>

              <div className="rating">
                {ratingData ? (
                  <>
                    <span className="stars">{renderStars(ratingData.avg)}</span>
                    <span className="rating-text">
                      {ratingData.avg.toFixed(1)} ({ratingData.count})
                    </span>
                  </>
                ) : (
                  <span>No ratings</span>
                )}
              </div>

              <span>{r.foods?.length || 0} items</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}