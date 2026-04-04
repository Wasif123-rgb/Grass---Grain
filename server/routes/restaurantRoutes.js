const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

const SECRET = "secret";

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= GET ALL RESTAURANTS (for customers) =================
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ADMIN RESTAURANT =================
router.get("/admin/:adminId", authMiddleware, async (req, res) => {
  let restaurant = await Restaurant.findOne({ adminId: req.params.adminId });

  if (!restaurant) {
    restaurant = new Restaurant({
      name: "My Restaurant",
      location: "",
      adminId: req.params.adminId,
      foods: []
    });
    await restaurant.save();
  }

  res.json([restaurant]);
});

// ================= UPDATE RESTAURANT INFO =================
router.put("/:restaurantId", authMiddleware, async (req, res) => {
  try {
    const { name, location } = req.body;
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (name) restaurant.name = name;
    if (location) restaurant.location = location;

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADD FOOD =================
router.post("/:restaurantId/foods", authMiddleware, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

  restaurant.foods.push({
    name: req.body.name,
    price: Number(req.body.price)
  });

  await restaurant.save();
  res.json({ foods: restaurant.foods });
});

// ================= DELETE FOOD =================
router.delete("/:restaurantId/foods/:index", authMiddleware, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

  restaurant.foods.splice(req.params.index, 1);
  await restaurant.save();
  res.json({ foods: restaurant.foods });
});

module.exports = router;