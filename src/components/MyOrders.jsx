import { useState, useEffect } from "react";
import "./myOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="my-orders-page">
      <h1>🛒 My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>Order ID: {order._id}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <p><strong>Restaurant:</strong> {order.restaurantName}</p>
              <p><strong>Total:</strong> ৳ {order.totalAmount}</p>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>৳ {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}