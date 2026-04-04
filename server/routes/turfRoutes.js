const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

/* ================= AUTH ================= */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= GET ALL TURFS ================= */
router.get("/", auth, async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADD TURF (ADMIN ONLY) ================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, location, price } = req.body;

    const turf = new Turf({
      name,
      location,
      price,
      adminId: req.user.id,
    });

    await turf.save();

    res.json(turf); // send added turf
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BOOK TURF (CUSTOMER ONLY) ================= */
router.post("/book/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can book" });
    }

    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Not found" });

    turf.bookings.push({
      customerId: req.user.id,
      date: new Date(),
    });

    await turf.save();

    res.json({ message: "Booked successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;