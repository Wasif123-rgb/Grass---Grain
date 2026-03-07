const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

/* ================= AUTH ================= */

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
   CREATE ORDER (CUSTOMER CHECKOUT)
===================================================== */

router.post("/", authMiddleware, async (req, res) => {

  try {

    const { items, totalAmount, restaurantId } = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      restaurantId,
      items,
      totalAmount,
      status: "Pending"
    });

    await newOrder.save();

    res.json({ message: "Order placed ✅", order: newOrder });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});


/* =====================================================
   GET MY ORDERS (CUSTOMER HISTORY)
===================================================== */

router.get("/my-orders", authMiddleware, async (req, res) => {

  const orders = await Order.find({ userId: req.user.id });

  res.json(orders);

});


/* =====================================================
   GET ALL ORDERS (ADMIN PANEL)
===================================================== */

router.get("/all", authMiddleware, async (req, res) => {

  const orders = await Order.find().populate("userId", "name email");

  res.json(orders);

});


/* =====================================================
   UPDATE ORDER STATUS (ADMIN)
===================================================== */

router.put("/:orderId/status", authMiddleware, async (req, res) => {

  const { status } = req.body;

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;

  await order.save();

  res.json({ message: "Status updated ✅", order });

});


module.exports = router;