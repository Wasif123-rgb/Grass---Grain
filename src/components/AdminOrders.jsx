import { useEffect, useState } from "react";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FETCH ALL ORDERS ================= */

  const fetchOrders = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.log("Error fetching orders");
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (orderId, status) => {

    try {

      await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      fetchOrders(); // refresh after update

    } catch (err) {
      console.log("Status update failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin - All Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map(order => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >

          <p>
            <b>Customer:</b>{" "}
            {order.userId?.name} ({order.userId?.email})
          </p>

          <p><b>Total:</b> ₹ {order.totalAmount}</p>
          <p><b>Status:</b> {order.status}</p>

          <h4>Items:</h4>

          {order.items.map((item, index) => (
            <p key={index}>
              {item.name} × {item.quantity} — ₹ {item.price}
            </p>
          ))}

          {/* STATUS SELECT */}
          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>
      ))}

    </div>
  );
}