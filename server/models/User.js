const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
      type: String,
      required: true,
      minlength: 8
    },

    /* ================= ROLE ADDED ================= */
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);