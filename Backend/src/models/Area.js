const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    subareas: {
      type: [String], // simple string list
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);
