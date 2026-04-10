const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
});

const TurfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  price: { type: Number, default: 0 },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  slots: [SlotSchema],
});

module.exports = mongoose.model("Turf", TurfSchema);