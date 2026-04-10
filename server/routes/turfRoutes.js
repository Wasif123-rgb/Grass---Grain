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
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= PUBLIC: GET ALL TURFS ================= */
router.get("/all", auth, async (req, res) => {
  const turfs = await Turf.find({});
  res.json(turfs);
});

/* ================= ADMIN: GET OWN TURFS ================= */
router.get("/admin", auth, async (req, res) => {
  const turfs = await Turf.find({ adminId: req.user.id });
  res.json(turfs);
});

/* ================= CREATE TURF ================= */
router.post("/", auth, async (req, res) => {
  const { name, location, price } = req.body;

  const turf = await Turf.create({
    name,
    location,
    price,
    adminId: req.user.id,
    slots: [],
  });

  res.json(turf);
});

/* ================= ADD SLOT ================= */
router.post("/:id/slots", auth, async (req, res) => {
  const { day, startTime, endTime } = req.body;

  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.slots.push({
    day,
    startTime,
    endTime,
    isBooked: false,
    bookedBy: null,
  });

  await turf.save();
  res.json(turf);
});

/* ================= DELETE SLOT ================= */
router.delete("/:id/slots/:index", auth, async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.slots.splice(req.params.index, 1);
  await turf.save();

  res.json(turf);
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", auth, async (req, res) => {
  const { slotIndex } = req.body;

  const turf = await Turf.findById(req.params.turfId);
  if (!turf) return res.status(404).json({ message: "Turf not found" });

  const slot = turf.slots[slotIndex];

  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.isBooked) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  slot.isBooked = true;
  slot.bookedBy = req.user.id;

  await turf.save();

  res.json({
    message: "Slot booked successfully",
    turf,
  });
});

module.exports = router;