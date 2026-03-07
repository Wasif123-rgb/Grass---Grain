const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  reviews: Number,
  image: String
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  foods: [foodSchema]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);