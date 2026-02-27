const mongoose = require("mongoose");
const posDb = require("../../../config/posDb");

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerMobile: {
      type: String,
      match: /^[6-9]\d{9}$/,
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        itemName: {
          type: String,
          required: true,
        },
        unitType: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0.01,
        },
        price: {
          type: Number, // snapshot price
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],

    subTotal: {
      type: Number,
      required: true,
    },

    billNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = posDb.model("Bill", billSchema);
