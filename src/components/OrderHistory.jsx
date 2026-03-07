import { useEffect, useState } from "react";

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    const res = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setOrders(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div key={order._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px"
          }}
        >
          <p><b>Total:</b> ₹ {order.totalAmount}</p>
          <p><b>Status:</b> {order.status}</p>

          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.quantity}
            </p>
          ))}
        </div>
      ))}

    </div>
  );
}