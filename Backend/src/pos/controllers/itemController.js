const Item = require("../models/Item");

//  Add Item (prevent duplicate name + unitType)
// const addItem = async (req, res) => {
//   try {
//     let { name, unitType, price, availableQty, image } = req.body;

//     if (!name || !unitType || price == null || availableQty == null) {
//       return res
//         .status(400)
//         .json({ msg: "All required fields must be provided" });
//     }

//     const normalizedName = name.trim().toLowerCase();

//     const existingItem = await Item.findOne({
//       name: normalizedName,
//       unitType,
//       isActive: true,
//     });

//     if (existingItem) {
//       return res.status(409).json({
//         msg: `Item '${name}' with unit '${unitType}' already exists. Please update price or quantity.`,
//       });
//     }

//     const item = await Item.create({
//       name: normalizedName,
//       unitType,
//       price,
//       availableQty,
//       image,
//     });

//     res.status(201).json({
//       msg: "Item added successfully",
//       item,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

const addItem = async (req, res) => {
  try {
    let { name, unitType, price, availableQty, image } = req.body;

    // Required fields check
    if (!name || !unitType || price == null || availableQty == null) {
      return res
        .status(400)
        .json({ msg: "All required fields must be provided" });
    }

    // Price validation (must be positive)
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        msg: "Price must be a positive number greater than 0",
      });
    }

    // Optional: quantity validation (recommended)
    if (typeof availableQty !== "number" || availableQty < 0) {
      return res.status(400).json({
        msg: "Available quantity must be 0 or more",
      });
    }

    // Normalize name
    const normalizedName = name.trim().toLowerCase();

    // Duplicate check (name + unitType)
    const existingItem = await Item.findOne({
      name: normalizedName,
      unitType,
      isActive: true,
    });

    if (existingItem) {
      return res.status(409).json({
        msg: `Item '${name}' with unit '${unitType}' already exists. Please update price or quantity.`,
      });
    }

    // Create item
    const item = await Item.create({
      name: normalizedName,
      unitType,
      price,
      availableQty,
      image,
    });

    res.status(201).json({
      msg: "Item added successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



//  Update price (immediate effect)
const updatePrice = async (req, res) => {
  try {
    const { price } = req.body;

    if (price == null || price < 0) {
      return res.status(400).json({ msg: "Invalid price" });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json({ msg: "Price updated successfully", item });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//  Get all active items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true }).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addItem,
  updatePrice,
  getItems,
};
