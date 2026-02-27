const mongoose = require("mongoose");
const posDb = require("../../../config/posDb");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // URL or local path
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unitType: {
      type: String,
      enum: ["number", "liter"],
      required: true,
    },

    availableQty: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
console.log("POS DB NAME:", posDb.name);


module.exports = posDb.model("Item", itemSchema);
