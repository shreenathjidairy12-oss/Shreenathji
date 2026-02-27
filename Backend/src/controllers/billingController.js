const Customer = require("../models/Customer");
// const DailyMilk = require("../models/DailyMilk"); 
const MonthlyBill = require("../models/MonthlyBill");
// const Customer = require('../models/Customer');
const MilkSetting = require("../models/Settings");
const MilkEntry = require("../models/MilkEntry");


// exports.getMonthlyBills = async (req, res) => {
//   try {
//     const { month, year } = req.query;

//     if (!month || !year) {
//       return res.status(400).json({ msg: "month and year required" });
//     }

//     const m = parseInt(month);
//     const y = parseInt(year);
//     const start = new Date(y, m - 1, 1);
//     const end = new Date(y, m, 1);

//     // Fetch existing bills
//     let monthlyBills = await MonthlyBill.find({ month: m, year: y }).populate("customerId");

//     // Fetch all customers
//     const customers = await Customer.find();

//     // Fetch Settings document
//     const milkSettings = await MilkSetting.findOne({ key: "milk_price_history" });

//     // Extract prices EXACTLY based on your Settings structure
//     const cowPrice = milkSettings?.value?.cow?.[0]?.price ?? 0;
//     const buffaloPrice = milkSettings?.value?.buffalo?.[0]?.price ?? 0;

//     // Function to select correct price
//     const getPrice = (milkType) => {
//       return milkType === "cow" ? cowPrice : buffaloPrice;
//     };

//     // Generate monthly bills if they don't exist
//     if (monthlyBills.length === 0) {
//       for (const cust of customers) {
//         // Fetch Milk Entries for the customer
//         const records = await MilkEntry.find({
//           customer: cust._id,
//           date: { $gte: start, $lt: end }
//         });

//         // Total liters = sum(ML / 1000)
//         const totalLiters = records.reduce(
//           (sum, r) => sum + (r.amountML ?? 0) / 1000,
//           0
//         );

//         // Correct price
//         const pricePerLiter = getPrice(cust.milkType);

//         // Calculate total charge
//         const totalCharge = totalLiters * pricePerLiter;

//         // Save bill
//         await MonthlyBill.create({
//           customerId: cust._id,
//           month: m,
//           year: y,
//           totalLiters,
//           totalCharge,
//           isPaid: false
//         });
//       }

//       // Re-fetch bills
//       monthlyBills = await MonthlyBill.find({ month: m, year: y }).populate("customerId");
//     }

//     // Format data
//     const response = monthlyBills.map(b => ({
//       customerId: b.customerId?._id,
//       name: b.customerId?.name,
//       milkType: b.customerId?.milkType,
//       totalLiters: b.totalLiters,
//       totalCharge: b.totalCharge,
//       isPaid: b.isPaid
//     }));

//     res.json(response);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error", err });
//   }
// };



exports.getMonthlyBills = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year)
      return res.status(400).json({ msg: "month and year required" });

    const m = parseInt(month);
    const y = parseInt(year);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);

    // Fetch all settings
    const milkSettings = await MilkSetting.findOne({ key: "milk_price_history" });
    const cowPrice = milkSettings?.value?.cow?.[0]?.price ?? 0;
    const buffaloPrice = milkSettings?.value?.buffalo?.[0]?.price ?? 0;

    const getPrice = (type) => (type === "cow" ? cowPrice : buffaloPrice);

    // Fetch all customers
    const customers = await Customer.find();

    // 1️⃣ Aggregate data for the entire month (fast, 1 query)
    const agg = await MilkEntry.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: "$customer", totalAmountML: { $sum: "$amountML" } } }
    ]);

    // Convert to object map
    const totalsMap = {};
    agg.forEach(row => {
      totalsMap[row._id.toString()] = (row.totalAmountML || 0) / 1000;
    });

    const results = [];

    // 2️⃣ Always calculate & UPSERT bills
    for (const cust of customers) {
      const cid = cust._id.toString();

      const totalLiters = totalsMap[cid] ?? 0;
      const price = getPrice(cust.milkType);
      const totalCharge = totalLiters * price;

      // UPSERT ensures bill is always updated
      await MonthlyBill.findOneAndUpdate(
        { customerId: cust._id, month: m, year: y },
        { totalLiters, totalCharge },
        { upsert: true }
      );

      results.push({
        customerId: cust._id,
        name: cust.name,
        milkType: cust.milkType,
        totalLiters,
        totalCharge,
      });
    }

    return res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", err });
  }
};
