const express = require("express");
const router = express.Router();


const authController = require("../controllers/authController");

// STAFF LOGIN (shopkeeper(admin but usd role as shopkeeper in backend) + vendor.  and generate token with 30d expiry -that wont be stored to db)
router.post("/staff/login", authController.staffLogin);

// CUSTOMER LOGIN (mobile only and generate token with 30d expiry - stored to localstorage only)
router.post("/customer/login", authController.customerLogin);

module.exports = router;
