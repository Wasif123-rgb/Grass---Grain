const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  price: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookings: [
    {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date },
    },
  ],
});

module.exports = mongoose.model("Turf", TurfSchema);