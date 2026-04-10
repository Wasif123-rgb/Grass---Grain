import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./restaurantDetail.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ================= FETCH RESTAURANT =================
  useEffect(() => {
    fetch(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(err => console.error(err));
  }, [id]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    if (!restaurant) return;
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [restaurant, id]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= ADD TO CART =================
  const addToCart = (food) => {
    const inCart = cart.find(i => i.name === food.name)?.quantity || 0;
    if (food.stock <= inCart) return alert("Stock limit reached!");
    
    setCart(prev => {
      const exists = prev.find(i => i.name === food.name);
      if (exists) return prev.map(i => i.name === food.name ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (name) => {
    setCart(prev => prev.filter(i => i.name !== name));
  };

  // ================= CHECKOUT =================
  const checkout = async () => {
    if (!cart.length) return alert("Cart empty");

    // Check stock
    for (const item of cart) {
      const original = restaurant.foods.find(f => f.name === item.name);
      if (item.quantity > original.stock) {
        return alert(`Cannot order ${item.name}. Only ${original.stock} left.`);
      }
    }

    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderItems = cart.map(item => ({
      foodId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          items: orderItems,
          totalAmount
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed ✅");
        setCart([]);
        // Reduce stock locally
        setRestaurant(prev => ({
          ...prev,
          foods: prev.foods.map(f => {
            const ordered = cart.find(i => i.name === f.name);
            return ordered ? { ...f, stock: f.stock - ordered.quantity } : f;
          })
        }));
      } else alert("Order failed ❌ " + data.message);

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
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ restaurantId: id, rating, comment })
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

  // ================= STAR RENDER =================
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "⯪" : "") + "☆".repeat(empty);
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-detail-page">
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
        {restaurant.foods?.map((food, i) => (
          <div key={i} className="menu-card">
            <h3>{food.name}</h3>
            <p>৳ {food.price}</p>
            <p>Stock: {food.stock}</p>
            <button 
              disabled={food.stock === 0} 
              onClick={() => addToCart(food)}
            >
              {food.stock === 0 ? "Out of Stock" : "Add"}
            </button>
          </div>
        ))}
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
            <button 
              className="checkout-btn" 
              disabled={cart.some(i => restaurant.foods.find(f => f.name === i.name).stock === 0)}
              onClick={checkout}
            >
              Checkout
            </button>
          </>
        )}
      </div>

      {/* Reviews */}
      <div className="review-box">
        <h3>⭐ Reviews</h3>
        <div className="review-form">
          <div className="interactive-stars">
            {[1,2,3,4,5].map(n => (
              <span 
                key={n} 
                className={rating >= n ? "star active" : "star"}
                onClick={() => setRating(n)}
              >
                ★
              </span>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Write your review..." 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
          />
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