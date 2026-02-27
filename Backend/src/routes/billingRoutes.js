const express = require("express");
const router = express.Router();

const { getMonthlyBills } = require("../controllers/billingController");

// ➤ GET all customer bills for selected month/year
router.get("/", getMonthlyBills);

module.exports = router;
