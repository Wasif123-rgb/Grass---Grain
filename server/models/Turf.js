const mongoose = require("mongoose");

/* ================= SLOT ================= */
const SlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  // booking status
  isBooked: {
    type: Boolean,
    default: false,
  },

  // who booked it
  bookedBy: {
    type: String, // ⚠️ changed to String for simplicity (stable)
    default: null,
  },
});

/* ================= TURF ================= */
const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: "" },
    price: { type: Number, default: 0 },

    adminId: {
      type: String, // ⚠️ simplified (no auth dependency issues)
      default: "demo-admin",
    },

    slots: [SlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);