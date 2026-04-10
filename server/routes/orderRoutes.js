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
    req.user = decoded; // contains id, name, etc.
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= PLACE ORDER (WITH STOCK CONTROL) =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, restaurantId } = req.body;

    if (!items || !restaurantId || !totalAmount) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ✅ CHECK STOCK
    for (const item of items) {
      const food = restaurant.foods.find(
        (f) => f._id.toString() === item.foodId
      );

      if (!food) {
        return res.status(400).json({
          message: `${item.name} not found`,
        });
      }

      if (food.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} out of stock`,
        });
      }
    }

    // ✅ REDUCE STOCK
    items.forEach((item) => {
      const food = restaurant.foods.find(
        (f) => f._id.toString() === item.foodId
      );

      if (food) {
        food.stock -= item.quantity;
      }
    });

    await restaurant.save(); // 🔥 VERY IMPORTANT

    // ✅ CREATE ORDER
    const order = new Order({
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      customerId: req.user.id,
      customerName: req.user.name,
      items,
      totalAmount,
      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully ✅",
      order,
    });
  } catch (err) {
    console.error("Order route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET CUSTOMER ORDERS =================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ADMIN ORDERS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      adminId: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "No restaurant found for this admin",
      });
    }

    const orders = await Order.find({
      restaurantId: restaurant._id,
    }).sort({ createdAt: -1 });

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

    if (!status) {
      return res.status(400).json({ message: "Missing status" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findOne({
      adminId: req.user.id,
    });

    if (
      !restaurant ||
      restaurant._id.toString() !== order.restaurantId.toString()
    ) {
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