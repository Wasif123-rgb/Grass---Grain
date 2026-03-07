import React, { useState, useMemo } from "react";
import Restaurant from "./restaurant";
import "./restaurants.css";

export default function Restaurants({ onBack }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const restaurantData = useMemo(() => [
    {
      name: "Sultan’s Dine",
      location: "Dhanmondi, Dhaka",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Kacchi_Biryani.jpg",
      type: "Kacchi & Bengali Cuisine",
      foods: [
        {
          name: "Kacchi Biryani",
          price: 320,
          rating: 4.7,
          reviews: 1200,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/4/45/Kacchi_Biryani.jpg",
        },
        {
          name: "Borhani",
          price: 60,
          rating: 4.5,
          reviews: 430,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/5/56/Borhani.jpg",
        },
        {
          name: "Chicken Roast",
          price: 180,
          rating: 4.6,
          reviews: 620,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Chicken_roast.jpg",
        },
      ],
    },
    {
      name: "Madchef",
      location: "Banani, Dhaka",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg",
      type: "Fast Food & Burgers",
      foods: [
        {
          name: "Beef Burger",
          price: 280,
          rating: 4.4,
          reviews: 980,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg",
        },
        {
          name: "Fries",
          price: 120,
          rating: 4.2,
          reviews: 540,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/8/83/French_Fries.JPG",
        },
        {
          name: "Fried Chicken",
          price: 240,
          rating: 4.5,
          reviews: 760,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/f/fc/Fried_Chicken.JPG",
        },
      ],
    },
  ], []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  /* ================= MENU VIEW ================= */
  if (selectedRestaurant) {
    return (
      <div className="page">
        <nav className="navbar">
          <div className="logo">Grass & Green</div>
          <div className="cart">🛒 {cartCount}</div>
        </nav>

        <div className="restaurants-container">
          <button
            className="back-btn"
            onClick={() => setSelectedRestaurant(null)}
          >
            ← Back to Restaurants
          </button>

          <h1 className="title">{selectedRestaurant.name}</h1>

          <div className="menu-grid">
            {selectedRestaurant.foods.map((food, index) => (
              <div key={index} className="menu-card">
                <img src={food.image} alt={food.name} />
                <div className="menu-content">
                  <h3>{food.name}</h3>
                  <p className="price">৳ {food.price}</p>
                  <p className="rating">
                    ⭐ {food.rating} ({food.reviews} reviews)
                  </p>
                  <button
                    className="add-btn"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="footer">
          © 2026 Grass & Green • All Rights Reserved
        </footer>
      </div>
    );
  }

  /* ================= RESTAURANT LIST VIEW ================= */
  return (
    <div className="page">
      <nav className="navbar">
        <div className="logo">Grass & Green</div>
      </nav>

      <div className="restaurants-container">
        
        {/* Back Button for Parent Project */}
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
        )}

        <h1 className="title">Explore Restaurants</h1>

        <div className="restaurant-grid">
          {restaurantData.map((rest, index) => (
            <Restaurant
              key={index}
              {...rest}
              onClick={() => setSelectedRestaurant(rest)}
            />
          ))}
        </div>
      </div>

      <footer className="footer">
        © 2026 Grass & Green
      </footer>
    </div>
  );
}