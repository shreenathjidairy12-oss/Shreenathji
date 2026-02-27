const mongoose = require("mongoose");

const PriceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
});

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // "milk_price_history"
    },

    value: {
      type: mongoose.Schema.Types.Mixed, default: {},  // <-- FLEXIBLE STRUCTURE
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Settings", SettingsSchema);
