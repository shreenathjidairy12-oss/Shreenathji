const mongoose = require("mongoose");
const { Schema } = mongoose;

const monthlyBillSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalLiters: { type: Number, default: 0 },
  totalCharge: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model("MonthlyBill", monthlyBillSchema);
