const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/billController");
const auth = require("../../middlewares/authMiddleware");
const { version } = require("pdfkit");

router.post("/", auth.verifyToken, ctrl.generateBill);

module.exports = router;
