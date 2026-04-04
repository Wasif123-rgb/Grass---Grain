import { useState, useEffect } from "react";
import "./adminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-orders-page">
      <h1>🍽 Orders</h1>
      {orders.length === 0 ? (
        <p className="empty-text">No orders yet</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order._id}</span>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-info">
                <p>
                  <strong>Restaurant:</strong> {order.restaurantName || "N/A"}
                </p>
                <p>
                  <strong>Total:</strong> ৳ {order.totalAmount}
                </p>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>৳ {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {order.status !== "Delivered" && (
                  <>
                    <button onClick={() => updateStatus(order._id, "Preparing")}>
                      Preparing
                    </button>
                    <button onClick={() => updateStatus(order._id, "Delivered")}>
                      Delivered
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}