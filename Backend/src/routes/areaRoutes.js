const express = require("express");
const router = express.Router();

const Area = require("../models/Area");
// const { verifyToken } = require("../middlewares/authMiddleware");

// -------------------------------------------------------------
// GET ALL AREAS (with subareas)
// -------------------------------------------------------------
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const areas = await Area.find().sort({ name: 1 }).lean();

//     return res.json({
//       msg: "Areas fetched successfully",
//       areas,
//     });

//   } catch (err) {
//     console.error("Error fetching areas:", err);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });

// // -------------------------------------------------------------
// // GET SUBAREAS FOR SPECIFIC AREA
// // -------------------------------------------------------------
// router.get("/:areaId/subareas", verifyToken, async (req, res) => {
//   try {
//     const { areaId } = req.params;

//     const area = await Area.findById(areaId).lean();
//     if (!area) return res.status(404).json({ msg: "Area not found" });

//     return res.json({
//       msg: "Subareas fetched successfully",
//       area: area.name,
//       subareas: area.subareas || [],
//     });

//   } catch (err) {
//     console.error("Error fetching subareas:", err);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });


const areaController = require("../controllers/areaController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");


// Shopkeeper only
router.post(
  "/staff/areas",
  verifyToken,
  allowRoles("shopkeeper"),
  areaController.createArea
);

// Shopkeeper only
router.patch(
  "/areas/:areaId/subareas",
  verifyToken,
  allowRoles("shopkeeper"),
  areaController.addSubareasToArea
);

// Vendor + Shopkeeper
router.get(
  "/areas",
  verifyToken,
  areaController.getAreas
);

module.exports = router;
