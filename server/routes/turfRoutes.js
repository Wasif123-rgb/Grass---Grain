const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

/* AUTH */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* GET TURFS */
router.get("/", auth, async (req, res) => {
  const turfs = await Turf.find({ adminId: req.user.id });
  res.json(turfs);
});

/* CREATE TURF */
router.post("/", auth, async (req, res) => {
  const { name, location, price } = req.body;

  const turf = await Turf.create({
    name,
    location,
    price,
    adminId: req.user.id,
  });

  res.json(turf);
});

/* ADD SLOT */
router.post("/:id/slots", auth, async (req, res) => {
  const { day, startTime, endTime } = req.body;

  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.slots.push({ day, startTime, endTime });
  await turf.save();

  res.json(turf);
});

/* DELETE SLOT */
router.delete("/:id/slots/:index", auth, async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Not found" });

  turf.slots.splice(req.params.index, 1);
  await turf.save();

  res.json(turf);
});

module.exports = router;