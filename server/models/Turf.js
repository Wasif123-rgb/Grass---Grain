const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,

  isBooked: {
    type: Boolean,
    default: false,
  },

  bookedBy: {
    type: String,
    default: null,
  },
});

const TurfSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    price: Number,
    adminId: {
      type: String,
      default: "demo-admin",
    },
    slots: [SlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);