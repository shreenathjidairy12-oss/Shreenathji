const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");

// Create initial shopkeeper if none exists
router.post("/shopkeeper", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "name,email,password required" });

    // allow creation only if no shopkeeper exists
    const existing = await Staff.findOne({ role: "shopkeeper" });
    if (existing)
      return res.status(400).json({ msg: "Shopkeeper already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const shopkeeper = await Staff.create({
      name,
      email,
      password: hashed,
      role: "shopkeeper",
    });

    res.status(201).json({
      msg: "Shopkeeper created",
      shopkeeper: {
        id: shopkeeper._id,
        name: shopkeeper.name,
        email: shopkeeper.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
