const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,

  isBooked: { type: Boolean, default: false },

  bookedBy: {
    type: String, // user name / id (simple)
    default: null,
  },
});

const TurfSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    price: Number,
    adminId: String,
    slots: [SlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);