const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");

/* ================= GET ALL TURFS (PUBLIC) ================= */
router.get("/all", async (req, res) => {
  try {
    const turfs = await Turf.find({});
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CREATE TURF ================= */
router.post("/", async (req, res) => {
  try {
    const { name, location, price } = req.body;

    const turf = await Turf.create({
      name,
      location,
      price,
      adminId: "demo-admin",
      slots: [],
    });

    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADD SLOT ================= */
router.post("/:id/slots", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Not found" });

    const { day, startTime, endTime } = req.body;

    // ❌ prevent duplicate slots
    const exists = turf.slots.some(
      (s) =>
        s.day === day &&
        s.startTime === startTime &&
        s.endTime === endTime
    );

    if (exists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    turf.slots.push({
      day,
      startTime,
      endTime,
      isBooked: false,
      bookedBy: null,
    });

    await turf.save();

    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", async (req, res) => {
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

    // demo booking user (later replace with real user id)
    slot.bookedBy = "demo-user";

    await turf.save();

    res.json({
      message: "Booked successfully",
      turf,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE SLOT ================= */
router.delete("/:id/slots/:index", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Not found" });

    turf.slots.splice(req.params.index, 1);

    await turf.save();

    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;