import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= FETCH ALL RESTAURANTS ================= */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  /* ================= CART ================= */
  const addToCart = (food) => {
    setCart(prev => {
      const exists = prev.find(item => item.name === food.name);
      if (exists) {
        return prev.map(item =>
          item.name === food.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const removeFromCart = (foodName) => {
    setCart(prev => prev.filter(item => item.name !== foodName));
  };

  const checkout = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: cart, totalAmount })
      });
      alert("Order Placed ✅");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* ================= RENDER SELECTED RESTAURANT ================= */
  if (selected) {
    return (
      <div className="restaurants-page">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <button onClick={() => setSelected(null)}>← Back</button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <h2>{selected.name}</h2>
        <p>{selected.location}</p>

        <div className="menu-grid">
          {selected.foods && selected.foods.length > 0 ? (
            selected.foods.map((food, index) => (
              <div key={index} className="menu-card">
                <h3>{food.name}</h3>
                <p>৳ {food.price}</p>
                <button onClick={() => addToCart(food)}>Add</button>
              </div>
            ))
          ) : (
            <p>No foods available yet.</p>
          )}
        </div>

        <div className="cart-box">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i}>
                  {item.name} x {item.quantity}{" "}
                  <button onClick={() => removeFromCart(item.name)}>Remove</button>
                </div>
              ))}
              <p>Total: ৳ {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
              <button onClick={checkout}>Checkout</button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ================= RENDER ALL RESTAURANTS ================= */
  return (
    <div className="restaurants-page">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Restaurants</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="restaurant-list">
        {restaurants.map(rest => (
          <div
            key={rest._id}
            className="restaurant-card"
            onClick={() => setSelected(rest)}
          >
            <h3>{rest.name}</h3>
            <p>{rest.location}</p>
            <p>{rest.foods ? rest.foods.length : 0} item(s) available</p>
          </div>
        ))}
      </div>
    </div>
  );
}