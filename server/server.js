const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api", authRoutes);

/* ================= DATABASE ================= */

mongoose.connect("mongodb://127.0.0.1:27017/grassgrain")
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Error ❌", err);
  });

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});