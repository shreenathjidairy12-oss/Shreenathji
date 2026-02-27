const express = require("express");
const router = express.Router();

const pdfController = require("../controllers/pdfController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Customer generates bill PDF (customer-only)
router.get(
  "/customers/:customerId/generate-bill",
  verifyToken,
  allowRoles("customer"),
  pdfController.generateMonthlyBill
);

module.exports = router;
