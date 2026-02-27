const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/, // Indian 10-digit mobile
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },

    subarea: {
      type: String,
      trim: true,
    },
    milkType: {
      type: String,
      enum: ["cow", "buffalo"],
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // shopkeeper
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
