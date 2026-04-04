const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

// AUTH
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= ADD REVIEW =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const review = new Review({
      restaurantId,
      customerId: req.user.id,
      customerName: req.user.name,
      rating,
      comment
    });

    await review.save();
    res.json({ message: "Review added ✅", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET REVIEWS =================
router.get("/:restaurantId", async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurantId: req.params.restaurantId
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= GET AVERAGE RATINGS =================
router.get("/avg/all", async (req, res) => {
  try {
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;