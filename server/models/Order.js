const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);