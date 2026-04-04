const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // id, name, email, role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= PLACE ORDER =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, restaurantId } = req.body;

    if (!items || !restaurantId || !totalAmount) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const order = new Order({
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      customerId: req.user.id,
      customerName: req.user.name,
      items,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully ✅", order });
  } catch (err) {
    console.error("Order route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET CUSTOMER ORDERS =================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ORDERS FOR ADMIN =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found for this admin" });

    const orders = await Order.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE ORDER STATUS =================
router.put("/:orderId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Missing status" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant || restaurant._id.toString() !== order.restaurantId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;