import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1>🛒 My Orders</h1>
        <button className="small-btn" onClick={() => navigate("/")}>Back</button>
      </div>

      {orders.length === 0 ? (
        <p className="empty-text">No orders yet</p>
      ) : (
        orders.map(o => (
          <div key={o._id} className="cart-box">
            <h3>{o.restaurantName}</h3>
            <p>Status: {o.status}</p>
            <ul>
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} x {i.quantity} - ৳ {i.price}</li>
              ))}
            </ul>
            <p>Total: ৳ {o.totalAmount}</p>
            <p>Ordered on: {new Date(o.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}