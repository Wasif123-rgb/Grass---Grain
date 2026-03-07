import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  /* ================= FETCH ADMIN RESTAURANT ================= */
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/restaurants/admin/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data && data[0]) {
          setRestaurant(data[0]);
          setFoods(data[0].foods || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, []);

  /* ================= ADD FOOD ================= */
  const addFood = async () => {
    if (!name || !price) return alert("Enter food name and price");

    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${restaurant._id}/foods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name, price: Number(price) })
        }
      );

      const data = await res.json();

      setFoods(data.foods); // update foods state
      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to add food");
    }
  };

  /* ================= DELETE FOOD ================= */
  const deleteFood = async (index) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${restaurant._id}/foods/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setFoods(data.foods);
    } catch (err) {
      console.error(err);
      alert("Failed to delete food");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!restaurant) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{restaurant.name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addFood}>Add Food</button>
      </div>

      <hr />

      <div>
        {foods.length === 0 ? (
          <p>No foods added yet.</p>
        ) : (
          foods.map((food, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>
                {food.name} - ৳ {food.price}
              </span>
              <button onClick={() => deleteFood(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}