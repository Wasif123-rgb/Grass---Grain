const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

/* =====================================================
   AUTH MIDDLEWARE (simple version)
   - Checks token exists
   - You can replace with your own authMiddleware
===================================================== */

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "secret";

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =====================================================
   GET RESTAURANTS BY ADMIN (FOR ADMIN DASHBOARD)
===================================================== */

router.get("/admin/:adminId", authMiddleware, async (req, res) => {

  try {

    const restaurants = await Restaurant.find({
      adminId: req.params.adminId
    });

    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


/* =====================================================
   GET ALL RESTAURANTS (FOR CUSTOMERS)
===================================================== */

router.get("/", async (req, res) => {

  try {

    const restaurants = await Restaurant.find()
      .populate("adminId", "name email");

    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


/* =====================================================
   ADD FOOD TO RESTAURANT
===================================================== */

router.post("/:restaurantId/foods", authMiddleware, async (req, res) => {

  try {

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.foods.push(req.body);

    await restaurant.save();

    res.json({ foods: restaurant.foods });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});


/* =====================================================
   UPDATE FOOD
===================================================== */

router.put("/:restaurantId/foods/:index", authMiddleware, async (req, res) => {

  try {

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const index = parseInt(req.params.index);

    if (index < 0 || index >= restaurant.foods.length) {
      return res.status(400).json({ message: "Invalid food index" });
    }

    restaurant.foods[index] = req.body;

    await restaurant.save();

    res.json({ foods: restaurant.foods });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});


/* =====================================================
   DELETE FOOD
===================================================== */

router.delete("/:restaurantId/foods/:index", authMiddleware, async (req, res) => {

  try {

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const index = parseInt(req.params.index);

    if (index < 0 || index >= restaurant.foods.length) {
      return res.status(400).json({ message: "Invalid food index" });
    }

    restaurant.foods.splice(index, 1);

    await restaurant.save();

    res.json({ foods: restaurant.foods });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});


module.exports = router;