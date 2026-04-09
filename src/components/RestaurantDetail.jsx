import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RestaurantDetail.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch restaurant & stock
  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/restaurants/${id}`);
      const data = await res.json();
      setRestaurant(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!restaurant) return;
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [restaurant, id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Add to cart (cannot exceed stock)
  const addToCart = (food) => {
    const inCart = cart.find(i => i.name === food.name)?.quantity || 0;
    if (inCart >= food.stock) return; // Cannot add more than stock
    setCart(prev => {
      const exists = prev.find(i => i.name === food.name);
      if (exists) return prev.map(i => i.name === food.name ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCart(prev => prev.filter(i => i.name !== name));
  };

  // Checkout: reduce stock on server
  const checkout = async () => {
    if (!cart.length) return alert("Cart empty");
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: cart, restaurantId: id }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Order placed ✅");
        setCart([]);
        await fetchRestaurant(); // Refresh stock from server
      } else {
        alert("Order failed ❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const submitReview = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: id, rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Review added ✅");
        setComment("");
        setRating(5);
        const updated = await fetch(`http://localhost:5000/api/reviews/${id}`);
        setReviews(await updated.json());
      } else alert(data.message);
    } catch (err) { console.error(err); }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(empty);
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-detail-page">
      {/* Header */}
      <div className="restaurant-header">
        <div className="header-left">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.location}</p>
        </div>
        <div className="header-right">
          <button className="small-btn" onClick={() => navigate("/my-orders")}>My Orders</button>
          <button className="small-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Menu */}
      <div className="menu-grid">
        {restaurant.foods?.map((food, i) => {
          const inCart = cart.find(i => i.name === food.name)?.quantity || 0;
          const availableStock = food.stock - inCart;
          return (
            <div key={i} className="menu-card">
              <h3>{food.name}</h3>
              <p>Price: ৳ {food.price}</p>
              <p>Stock: {availableStock}</p>
              <button onClick={() => addToCart(food)} disabled={availableStock <= 0}>
                {availableStock <= 0 ? "Out of Stock" : "Add"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart */}
      <div className="cart-box">
        <h3>🛒 Cart</h3>
        {!cart.length ? <p className="empty-text">Cart empty</p> : (
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

      {/* Reviews */}
      <div className="review-box">
        <h3>⭐ Reviews</h3>
        <div className="review-form">
          <div className="interactive-stars">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={`star ${rating >= n ? "full" : "empty"}`} onClick={() => setRating(n)}>★</span>
            ))}
          </div>
          <input type="text" placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} />
          <button className="submit-review-btn" onClick={submitReview}>Submit</button>
        </div>

        <div className="review-list">
          {reviews.length ? reviews.map((r,i) => (
            <div key={i} className="review-card">
              <div className="review-top">
                <strong>{r.customerName}</strong>
                <span className="stars-display">{renderStars(r.rating)}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          )) : <p>No reviews yet</p>}
        </div>
      </div>
    </div>
  );
}