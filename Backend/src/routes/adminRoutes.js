const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const customerController = require("../controllers/customerController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Fetch paginated customer list
router.get(
  "/customers",
  verifyToken,
  allowRoles("shopkeeper"),
  adminController.getCustomersPaginated
);

// Monthly summary using shared logic
router.get(
  "/customers/:customerId/monthly",
  verifyToken,
  allowRoles("shopkeeper"),
  adminController.getCustomerMonthlyForAdmin
);

// Daily summary (total litres, vendor-wise, area-wise)
router.get(
  "/daily-summary",
  verifyToken,
  allowRoles("shopkeeper"),
  adminController.getDailySummary
);

module.exports = router;
