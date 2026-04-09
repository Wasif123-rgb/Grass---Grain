const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "Unknown" },
  adminId: { type: String, required: true },
  foods: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true, default: 0 }
    }
  ]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);