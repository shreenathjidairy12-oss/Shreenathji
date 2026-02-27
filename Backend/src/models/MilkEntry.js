const mongoose = require("mongoose");

const MilkEntrySchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true,
        },

        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },
        milkType: {
            type: String,
            enum: ["cow", "buffalo"],
            required: true
        },


        amountML: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

// Prevent duplicate entry for same customer + date
MilkEntrySchema.index(
    { customer: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model("MilkEntry", MilkEntrySchema);
