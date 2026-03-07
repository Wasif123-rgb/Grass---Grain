import { useState, useEffect } from "react";
import "../components/admin.css";

export default function AdminDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    rating: 0,
    reviews: 0,
    image: ""
  });

  /* ================= FETCH RESTAURANT ================= */

  useEffect(() => {

    const fetchRestaurant = async () => {

      const res = await fetch(
        `http://localhost:5000/api/restaurants/admin/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.length > 0) {
        setRestaurant(data[0]);
        setFoods(data[0].foods);
      }
    };

    fetchRestaurant();

  }, []);

  /* ================= ADD FOOD ================= */

  const addFood = async () => {

    const res = await fetch(
      `http://localhost:5000/api/restaurants/${restaurant._id}/foods`,
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
      rating: 0,
      reviews: 0,
      image: ""
    });
  };

  /* ================= DELETE FOOD ================= */

  const deleteFood = async (index) => {

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
  };

  /* ================= UPDATE FOOD ================= */

  const updateFood = async (index, key, value) => {

    const updated = [...foods];
    updated[index][key] = value;

    const res = await fetch(
      `http://localhost:5000/api/restaurants/${restaurant._id}/foods/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated[index])
      }
    );

    const data = await res.json();

    setFoods(data.foods);
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="admin-page">

      <nav className="navbar">
        <h2>{restaurant.name}</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>

      <div className="admin-container">

        <h2>Menu Management</h2>

        <table className="food-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {foods.map((food, index) => (

              <tr key={index}>

                <td>
                  <input
                    value={food.name}
                    onChange={(e) =>
                      updateFood(index, "name", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    value={food.price}
                    onChange={(e) =>
                      updateFood(index, "price", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    value={food.image}
                    onChange={(e) =>
                      updateFood(index, "image", e.target.value)
                    }
                  />
                </td>

                <td>
                  <button onClick={() => deleteFood(index)}>
                    Delete
                  </button>
                </td>

              </tr>

            ))}

            {/* ADD NEW FOOD */}

            <tr>

              <td>
                <input
                  placeholder="Food Name"
                  value={newFood.name}
                  onChange={(e) =>
                    setNewFood({ ...newFood, name: e.target.value })
                  }
                />
              </td>

              <td>
                <input
                  placeholder="Price"
                  value={newFood.price}
                  onChange={(e) =>
                    setNewFood({ ...newFood, price: e.target.value })
                  }
                />
              </td>

              <td>
                <input
                  placeholder="Image URL"
                  value={newFood.image}
                  onChange={(e) =>
                    setNewFood({ ...newFood, image: e.target.value })
                  }
                />
              </td>

              <td>
                <button onClick={addFood}>
                  Add
                </button>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}