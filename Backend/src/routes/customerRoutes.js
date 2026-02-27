const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Get monthly summary (total ML, total liters, total amount)
router.get(
  "/:customerId/summary",
  verifyToken,
  allowRoles("customer"),
  customerController.getMonthlySummary
);

// Get calendar entries (all days of month)
router.get(
  "/:customerId/calendar",
  verifyToken,
  allowRoles("customer"),
  customerController.getCalendar
);

module.exports = router;
