const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/itemController");
const auth = require("../../middlewares/authMiddleware");

router.post("/", auth.verifyToken, ctrl.addItem);
router.get("/", auth.verifyToken, ctrl.getItems);
router.patch("/:id", auth.verifyToken, ctrl.updateItem);
router.delete("/:id",auth.verifyToken, ctrl.deleteItem);

module.exports = router;
