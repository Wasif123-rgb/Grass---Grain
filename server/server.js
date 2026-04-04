const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const turfRoutes = require("./routes/turfRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/turfs", turfRoutes);

// DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/grassgrain")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// SERVER
app.listen(5000, () => console.log("Server running on port 5000"));