const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  adminId: String,
  foods: Array,

  reviews: [reviewSchema],   // ⭐ reviews
  avgRating: { type: Number, default: 0 } // ⭐ average rating
});

module.exports = mongoose.model("Restaurant", restaurantSchema);