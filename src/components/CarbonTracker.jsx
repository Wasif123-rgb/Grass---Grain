import React from "react";
import carbonFootprint from "react-carbon-footprint";

function CarbonTracker() {
  // Example data (you can customize this)
  const result = carbonFootprint({
    transport: 10,     // km
    electricity: 5,    // kWh
    food: 3,           // meals
    streaming: 2       // hours
  });

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid gray",
        borderRadius: "10px",
      }}
    >
      <h2>Your Carbon Footprint</h2>

      <p>🌱 Total CO₂: {result.total} kg</p>

      <h3>Breakdown:</h3>
      <ul>
        <li>🚗 Transport: {result.transport} kg</li>
        <li>⚡ Electricity: {result.electricity} kg</li>
        <li>🍔 Food: {result.food} kg</li>
        <li>🎬 Streaming: {result.streaming} kg</li>
      </ul>
    </div>
  );
}

export default CarbonTracker;