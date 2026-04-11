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
    (s) =>
      s.day === day &&
      s.startTime === startTime &&
      s.endTime === endTime
  );

  if (exists) {
    return res.status(400).json({ message: "Duplicate slot" });
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
});
/* ================= DELETE SLOT (ADMIN) ================= */
router.delete("/:turfId/slots/:slotIndex", async (req, res) => {
  try {
    const { turfId, slotIndex } = req.params;

    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    if (!turf.slots[slotIndex]) {
      return res.status(404).json({ message: "Slot not found" });
    }

    turf.slots.splice(slotIndex, 1); // remove slot

    await turf.save();

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BOOK SLOT ================= */
router.post("/book/:turfId", async (req, res) => {
  try {
    const { slotIndex, user } = req.body;

    const turf = await Turf.findById(req.params.turfId);
    if (!turf) return res.status(404).json({ message: "Not found" });

    const slot = turf.slots[slotIndex];

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Already booked" });
    }

    slot.isBooked = true;
    slot.bookedBy = user; // ⚠️ IMPORTANT: must be real userId

    await turf.save();

    res.json({ message: "Booked successfully", turf });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN BOOKING VIEW ================= */
router.get("/admin/bookings", async (req, res) => {
  const turfs = await Turf.find({});

  const bookings = [];

  turfs.forEach((turf) => {
    turf.slots.forEach((slot, index) => {
      if (slot.isBooked) {
        bookings.push({
          turfId: turf._id,
          slotIndex: index, // IMPORTANT FOR CANCEL
          turfName: turf.name,
          location: turf.location,
          day: slot.day,
          time: `${slot.startTime} - ${slot.endTime}`,
          bookedBy: slot.bookedBy,
        });
      }
    });
  });

  res.json(bookings);
});

/* ================= USER BOOKINGS ================= */
router.get("/my-bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const turfs = await Turf.find({});

    const myBookings = [];

    turfs.forEach((turf) => {
      turf.slots.forEach((slot) => {
        if (slot.isBooked && slot.bookedBy === userId) {
          myBookings.push({
            turfId: turf._id,
            turfName: turf.name,
            location: turf.location,
            day: slot.day,
            time: `${slot.startTime} - ${slot.endTime}`,
          });
        }
      });
    });

    res.json(myBookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN CANCEL BOOKING ================= */
router.post("/admin/cancel/:turfId", async (req, res) => {
  try {
    const { slotIndex } = req.body;

    const turf = await Turf.findById(req.params.turfId);
    if (!turf) return res.status(404).json({ message: "Not found" });

    const slot = turf.slots[slotIndex];

    if (!slot || !slot.isBooked) {
      return res.status(400).json({ message: "Slot not booked" });
    }

    slot.isBooked = false;
    slot.bookedBy = null;

    await turf.save();

    res.json({ message: "Cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;