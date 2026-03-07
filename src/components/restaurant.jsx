import React from "react";
import "./restaurant.css";

export default function Restaurant({
  name,
  location,
  image,
  type,
  onClick,
}) {
  const dummyImage =
    "https://via.placeholder.com/400x300?text=Restaurant";

  return (
    <div className="restaurant-card" onClick={onClick}>
      <div className="image-wrapper">
        <img
          src={image || dummyImage}
          alt={name}
          className="restaurant-image"
          onError={(e) => (e.target.src = dummyImage)}
        />
      </div>

      <div className="restaurant-content">
        <h2>{name}</h2>
        <p className="type">{type}</p>
        <p className="location">{location}</p>
      </div>
    </div>
  );
}