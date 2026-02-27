const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Fetch customers by area & subarea
router.get(
  "/customers",
  verifyToken,
  allowRoles("vendor", "shopkeeper"), // shopkeeper can also check
  vendorController.getCustomersByArea
);

// Fetch monthly calendar for customer
router.get(
  "/customers/:customerId/calendar",
  verifyToken,
  allowRoles("vendor", "shopkeeper"),
  vendorController.getCustomerCalendar
);

// Create or Update milk entry
router.post(
  "/milk-entry",
  verifyToken,
  allowRoles("vendor", "shopkeeper"),
  vendorController.createOrUpdateMilkEntry
);

module.exports = router;
