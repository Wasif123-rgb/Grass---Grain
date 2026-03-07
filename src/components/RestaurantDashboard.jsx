import { useState, useEffect } from "react";

export default function RestaurantDashboard({ restaurantId }) {

  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    image: ""
  });

  /* ================= FETCH RESTAURANT ================= */

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {

    const res = await fetch(
      `http://localhost:5000/api/restaurants/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setRestaurant(data);
    setFoods(data.foods);
  };

  /* ================= ADD FOOD ================= */

  const addFood = async () => {

    const res = await fetch(
      `http://localhost:5000/api/restaurants/${restaurantId}/foods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newFood)
      }
    );

    const data = await res.json();

    setFoods(data.foods);

    setNewFood({
      name: "",
      price: "",
      image: ""
    });
  };

  /* ================= DELETE FOOD ================= */

  const deleteFood = async (index) => {

    const res = await fetch(
      `http://localhost:5000/api/restaurants/${restaurantId}/foods/${index}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setFoods(data.foods);
  };

  /* ================= UI ================= */

  if (!restaurant) return <h2>Loading Restaurant...</h2>;

  return (
    <div style={{ padding: "20px" }}>

      <h1>{restaurant.name}</h1>
      <p>{restaurant.location}</p>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

      <hr />

      <h2>Add Food</h2>

      <input
        placeholder="Food Name"
        value={newFood.name}
        onChange={(e) =>
          setNewFood({ ...newFood, name: e.target.value })
        }
      />

      <input
        placeholder="Price"
        value={newFood.price}
        onChange={(e) =>
          setNewFood({ ...newFood, price: e.target.value })
        }
      />

      <input
        placeholder="Image URL"
        value={newFood.image}
        onChange={(e) =>
          setNewFood({ ...newFood, image: e.target.value })
        }
      />

      <button onClick={addFood}>
        Add Food
      </button>

      <hr />

      <h2>Foods</h2>

      {foods.map((food, index) => (
        <div
          key={index}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px"
          }}
        >
          <p><b>{food.name}</b></p>
          <p>Price: {food.price}</p>

          {food.image && (
            <img
              src={food.image}
              width="100"
              alt="food"
            />
          )}

          <br />

          <button onClick={() => deleteFood(index)}>
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}