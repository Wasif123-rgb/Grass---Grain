import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import AdminOrdersBadge from "./AdminOrdersBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [restName, setRestName] = useState("");
  const [restLocation, setRestLocation] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");

  // New state for orders
  const [restaurantOrders, setRestaurantOrders] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/restaurants/admin/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data && data[0]) {
          setRestaurant(data[0]);
          setFoods(data[0].foods || []);
          setRestName(data[0].name);
          setRestLocation(data[0].location || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurant();
  }, [user.id, token]);

  // Fetch orders for this restaurant
  useEffect(() => {
    if (!restaurant) return;

    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRestaurantOrders(data))
      .catch(err => console.error(err));
  }, [restaurant, token]);

  const updateRestaurant = async () => {
    if (!restName || !restLocation) return alert("Enter name and location");
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${restaurant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: restName, location: restLocation }),
        }
      );
      const data = await res.json();
      setRestaurant(data);
      alert("Restaurant updated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update restaurant");
    }
  };

  const addFood = async () => {
    if (!foodName || !foodPrice) return alert("Enter food name and price");
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${restaurant._id}/foods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: foodName, price: Number(foodPrice) }),
        }
      );
      const data = await res.json();
      setFoods(data.foods);
      setFoodName("");
      setFoodPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to add food");
    }
  };

  const deleteFood = async (index) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${restaurant._id}/foods/${index}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setFoods(data.foods);
    } catch (err) {
      console.error(err);
      alert("Failed to delete food");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!restaurant) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">

      {/* 🔥 NAVBAR */}
      <nav className="admin-navbar">
        <div className="nav-left">
          <h1>{restaurant.name || "My Restaurant"}</h1>
          <span>{restaurant.location || "Location not set"}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="logout-btn" onClick={handleLogout}>
            ⏻ Logout
          </button>
          <AdminOrdersBadge token={token} />
        </div>
      </nav>

      {/* PANELS */}
      <div className="dashboard-panels">
        <div className="panel">
          <h2>Restaurant Info</h2>
          <input value={restName} onChange={(e) => setRestName(e.target.value)} placeholder="Restaurant Name" />
          <input value={restLocation} onChange={(e) => setRestLocation(e.target.value)} placeholder="Location" />
          <button onClick={updateRestaurant}>Update Info</button>
        </div>

        <div className="panel">
          <h2>Add Food Item</h2>
          <input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food Name" />
          <input type="number" value={foodPrice} onChange={(e) => setFoodPrice(e.target.value)} placeholder="Price" />
          <button onClick={addFood}>Add Food</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="food-table-container">
        <h2>Food Items</h2>
        {foods.length === 0 ? (
          <p className="empty-text">No foods added yet.</p>
        ) : (
          <table className="food-table">
            <thead>
              <tr>
                <th>🍽 Name</th>
                <th>💰 Price (৳)</th>
                <th>⚙ Action</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td>{food.price}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteFood(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= ADMIN ORDERS ================= */}
      <div className="orders-table-container">
        <h2>Customer Orders</h2>
        {restaurantOrders.length === 0 ? (
          <p className="empty-text">No orders yet.</p>
        ) : (
          <table className="food-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total (৳)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {restaurantOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.userName}</td>
                  <td>
                    {order.items.map((i, idx) => (
                      <div key={idx}>{i.name} x {i.quantity}</div>
                    ))}
                  </td>
                  <td>{order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}