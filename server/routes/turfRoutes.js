const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");

/* ================= GET ALL TURFS ================= */
router.get("/all", async (req, res) => {
  const turfs = await Turf.find({});
  res.json(turfs);
});

/* ================= CREATE TURF ================= */
router.post("/", async (req, res) => {
  const turf = await Turf.create({
    ...req.body,
    adminId: "demo-admin",
    slots: [],
  });

  res.json(turf);
});

/* ================= ADD SLOT ================= */
router.post("/:id/slots", async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  const { day, startTime, endTime } = req.body;

  const exists = turf.slots.some(
    (s) =>
      s.day === day &&
      s.startTime === startTime &&
      s.endTime === endTime
  );

  if (exists) {
    return res.status(400).json({ message: "Duplicate slot" });
  }

  turf.slots.push({ day, startTime, endTime });
  await turf.save();

  res.json(turf);
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", async (req, res) => {
  const { slotIndex, user } = req.body;

  const turf = await Turf.findById(req.params.turfId);
  if (!turf) return res.status(404).json({ message: "Turf not found" });

  const slot = turf.slots[slotIndex];
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.isBooked) {
    return res.status(400).json({ message: "Already booked" });
  }

  slot.isBooked = true;
  slot.bookedBy = user || "guest";

  await turf.save();

  res.json(turf);
});

/* ================= DELETE SLOT ================= */
router.delete("/:id/slots/:index", async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.slots.splice(req.params.index, 1);
  await turf.save();

  res.json(turf);
});

module.exports = router;