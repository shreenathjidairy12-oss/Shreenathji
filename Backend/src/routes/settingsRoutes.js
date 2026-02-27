const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settingsController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Update milk price (shopkeeper only)
router.post(
  "/milk-price",
  verifyToken,
  allowRoles("shopkeeper"),
  settingsController.updateMilkPrice
);

module.exports = router;
