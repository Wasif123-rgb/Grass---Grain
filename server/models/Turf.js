const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  isBooked: {
    type: Boolean,
    default: false,
  },

  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: "" },
    price: { type: Number, default: 0 },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slots: [SlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);