const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

/* ================= AUTH ================= */
const auth = (req, res, next) => {
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

/* ================= GET ALL TURFS (PUBLIC) ================= */
router.get("/all", async (req, res) => {
  try {
    const turfs = await Turf.find({});
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN TURFS ================= */
router.get("/admin", auth, async (req, res) => {
  try {
    const turfs = await Turf.find({ adminId: req.user.id });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CREATE TURF ================= */
router.post("/", auth, async (req, res) => {
  try {
    const { name, location, price } = req.body;

    const turf = await Turf.create({
      name,
      location,
      price,
      adminId: req.user.id,
      slots: [],
    });

    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADD SLOT ================= */
router.post("/:id/slots", auth, async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Not found" });

    turf.slots.push(req.body);

    await turf.save();
    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", auth, async (req, res) => {
  try {
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

    res.json({ message: "Booked successfully", turf });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;