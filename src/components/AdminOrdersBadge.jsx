import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOrdersBadge({ token }) {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const pending = data.filter(order => order.status !== "Delivered").length;
        setPendingCount(pending);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [token]);

  if (pendingCount === 0) return null;

  return (
    <span
      onClick={() => navigate("/admin/orders")}
      style={{
        background: "#e63946",
        color: "white",
        padding: "2px 6px",
        borderRadius: "8px",
        marginLeft: "8px",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
      title="View Pending Orders"
    >
      {pendingCount}
    </span>
  );
}