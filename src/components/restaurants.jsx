import { useState, useEffect } from "react";
import "../components/restaurants.css";

export default function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= FETCH RESTAURANTS ================= */

  useEffect(() => {

    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));

  }, []);

  /* ================= ADD TO CART ================= */

  const addToCart = (food) => {

    setCart(prev => {

      const exists = prev.find(item => item.name === food.name);

      if (exists) {
        return prev.map(item =>
          item.name === food.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...food, quantity: 1 }];
    });

  };

  /* ================= CHECKOUT ================= */

  const checkout = async () => {

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        totalAmount
      })
    });

    alert("Order Placed ✅");

    setCart([]);

  };

  if (selected) {

    return (
      <div className="restaurants-page">

        <button onClick={() => setSelected(null)}>
          ← Back
        </button>

        <h2>{selected.name}</h2>

        <div className="menu-grid">

          {selected.foods.map((food, index) => (

            <div key={index} className="menu-card">

              <h3>{food.name}</h3>
              <p>৳ {food.price}</p>

              <button onClick={() => addToCart(food)}>
                Add
              </button>

            </div>

          ))}

        </div>

        <div className="cart-box">

          <h3>Cart</h3>

          {cart.map((item, i) => (
            <div key={i}>
              {item.name} x {item.quantity}
            </div>
          ))}

          {cart.length > 0 && (
            <button onClick={checkout}>
              Checkout
            </button>
          )}

        </div>

      </div>
    );

  }

  return (
    <div className="restaurants-page">

      <h1>Restaurants</h1>

      <div className="restaurant-list">

        {restaurants.map(rest => (

          <div
            key={rest._id}
            className="restaurant-card"
            onClick={() => setSelected(rest)}
          >

            <h3>{rest.name}</h3>
            <p>{rest.location}</p>

          </div>

        ))}

      </div>

    </div>
  );
}