const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const areaController = require("../controllers/areaController");
const vendorController = require("../controllers/vendorController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// ============================================================
// VENDOR MANAGEMENT (shopkeeper only)
// ============================================================

// add vendor (shopkeeper only)
router.post(
  "/vendors",
  verifyToken,
  allowRoles("shopkeeper"),
  staffController.createVendor
);

// ============================================================
// CUSTOMER MANAGEMENT
// ============================================================

// add customer (shopkeeper only)
router.post(
  "/customers",
  verifyToken,
  allowRoles("shopkeeper"),
  staffController.createCustomer
);

// Fetch customers by area & subarea (vendor & shopkeeper)
router.get(
  "/customers",
  verifyToken,
  allowRoles("vendor", "shopkeeper"),
  vendorController.getCustomersByArea
);

// Fetch monthly calendar for customer (vendor & shopkeeper)
router.get(
  "/customers/:customerId/calendar",
  verifyToken,
  allowRoles("vendor", "shopkeeper"),
  vendorController.getCustomerCalendar
);

// ============================================================
// AREA MANAGEMENT
// ============================================================

// add area (shopkeeper only)
router.post(
  "/areas",
  verifyToken,
  allowRoles("shopkeeper"),
  areaController.createArea
);

// get all areas (shopkeeper & vendor)
router.get(
  "/areas",
  verifyToken,
  allowRoles("shopkeeper", "vendor"),
  areaController.getAreas
);

// get subareas for specific area (shopkeeper & vendor)
router.get(
  "/areas/:areaId/subareas",
  verifyToken,
  allowRoles("shopkeeper", "vendor"),
  areaController.getSubareas
);

// add subareas to area (shopkeeper only)
router.patch(
  "/areas/:areaId/subareas",
  verifyToken,
  allowRoles("shopkeeper"),
  areaController.addSubareasToArea
);

// ============================================================
// MILK ENTRY MANAGEMENT (vendor & shopkeeper)
// ============================================================

// Create or Update milk entry
router.post(
  "/milk-entry",
  verifyToken,
  allowRoles("vendor", "shopkeeper"),
  vendorController.createOrUpdateMilkEntry
);


module.exports = router;
