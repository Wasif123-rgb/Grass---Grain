const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");

/* ================= GET ALL TURFS ================= */
router.get("/all", async (req, res) => {
  const data = await Turf.find({});
  res.json(data);
});

/* ================= CREATE TURF ================= */
router.post("/", async (req, res) => {
  const turf = await Turf.create({
    ...req.body,
    adminId: "demo-admin",
  });

  res.json(turf);
});

/* ================= ADD SLOT ================= */
router.post("/:id/slots", async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  const { day, startTime, endTime } = req.body;

  const exists = turf.slots.some(
    (s) => s.day === day && s.startTime === startTime && s.endTime === endTime
  );

  if (exists) {
    return res.status(400).json({ message: "Duplicate slot" });
  }

  turf.slots.push({ day, startTime, endTime, isBooked: false });

  await turf.save();
  res.json(turf);
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", async (req, res) => {
  const { slotIndex, user } = req.body;

  const turf = await Turf.findById(req.params.turfId);
  if (!turf) return res.status(404).json({ message: "Not found" });

  const slot = turf.slots[slotIndex];

  if (slot.isBooked) {
    return res.status(400).json({ message: "Already booked" });
  }

  slot.isBooked = true;
  slot.bookedBy = user || "guest";

  await turf.save();

  res.json(turf);
});

/* ================= ADMIN BOOKING VIEW ================= */
router.get("/admin/bookings", async (req, res) => {
  const turfs = await Turf.find({});

  const bookings = [];

  turfs.forEach((turf) => {
    turf.slots.forEach((slot) => {
      if (slot.isBooked) {
        bookings.push({
          turfName: turf.name,
          location: turf.location,
          price: turf.price,
          day: slot.day,
          time: `${slot.startTime} - ${slot.endTime}`,
          bookedBy: slot.bookedBy,
        });
      }
    });
  });

  res.json(bookings);
});

module.exports = router;