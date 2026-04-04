const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Turf = require("../models/Turf"); // new model for turfs

const SECRET = process.env.JWT_SECRET || "secret";

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer"
    });

    await newUser.save();

    // Auto-create restaurant if admin
    let restaurant = null;
    if (newUser.role === "restaurant-admin") {
      restaurant = new Restaurant({
        name: `${newUser.name}'s Restaurant`,
        adminId: newUser._id,
        foods: []
      });
      await restaurant.save();
    }

    // Auto-create turf if turf-admin (optional)
    let turf = null;
    if (newUser.role === "turf-admin") {
      turf = new Turf({
        name: `${newUser.name}'s Turf`,
        adminId: newUser._id,
        location: "",
        price: 0
      });
      await turf.save();
    }

    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      restaurant,
      turf
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      SECRET,
      { expiresIn: "7d" }
    );

    let restaurant = null;
    if (user.role === "restaurant-admin") {
      restaurant = await Restaurant.findOne({ adminId: user._id });
    }

    let turf = null;
    if (user.role === "turf-admin") {
      turf = await Turf.findOne({ adminId: user._id });
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      restaurant,
      turf
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;