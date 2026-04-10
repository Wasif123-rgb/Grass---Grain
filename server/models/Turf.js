const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  price: { type: Number, default: 0 },

  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  slots: [
    {
      day: String,
      startTime: String,
      endTime: String,
    }
  ],

  bookings: [
    {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: Date,
      slot: {
        day: String,
        startTime: String,
        endTime: String,
      }
    }
  ],
});

module.exports = mongoose.model("Turf", TurfSchema);