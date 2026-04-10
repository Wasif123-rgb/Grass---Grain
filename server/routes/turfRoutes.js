const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

/* AUTH */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* GET TURFS */
router.get("/", auth, async (req, res) => {
  const turfs = await Turf.find();
  res.json(turfs);
});

/* CREATE TURF */
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { name, location, price, slots } = req.body;

  const turf = await Turf.create({
    name,
    location,
    price,
    slots,
    adminId: req.user.id,
  });

  res.json(turf);
});

/* BOOK TURF */
router.post("/book/:id", auth, async (req, res) => {
  const { date, slot } = req.body;

  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.bookings.push({
    customerId: req.user.id,
    date,
    slot,
  });

  await turf.save();

  res.json({ message: "Booked successfully" });
});

module.exports = router;