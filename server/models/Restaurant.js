const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "Unknown" },
  adminId: { type: String, required: true },
  foods: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);