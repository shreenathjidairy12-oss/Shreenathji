const MilkEntry = require("../models/MilkEntry");
const Settings = require("../models/Settings");
const Customer = require("../models/Customer");

// -------------------------------------------------------------
// Helper: Get price for a given date from price history
// -------------------------------------------------------------
const getPriceForDate = (priceHistory, date) => {
  // Sort history by effectiveFrom ascending
  const sorted = [...priceHistory].sort(
    (a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom)
  );

  let applicablePrice = sorted[0]?.price || 0;

  for (let i = 0; i < sorted.length; i++) {
    if (new Date(date) >= new Date(sorted[i].effectiveFrom)) {
      applicablePrice = sorted[i].price;
    }
  }

  return applicablePrice;
};

// -------------------------------------------------------------
// 1) Get customer's monthly summary (milk totals + bill amount)
// -------------------------------------------------------------
// exports.getMonthlySummary = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { month, year } = req.query; // month = 1–12

//     // Ensure customer can only access own data
// // Allow only:
// // 1) customer accessing their own data
// // 2) shopkeeper/admin calling through admin controller
// if (req.user.role === "customer" && req.user.id !== customerId) {
//   return res.status(403).json({ msg: "Access denied" });
// }


//     if (!month || !year)
//       return res.status(400).json({ msg: "month & year required" });

//     const start = new Date(year, month - 1, 1);
//     const end = new Date(year, month, 1);

//     // Fetch milk entries for customer
//     const entries = await MilkEntry.find({
//       customer: customerId,
//       date: { $gte: start, $lt: end },
//     }).sort({ date: 1 });

//     // Fetch price history
//     const settings = await Settings.findOne({ key: "milk_price_history" });
//     const history = settings?.value || [];

//     let totalML = 0;
//     let totalAmount = 0;

//     entries.forEach((entry) => {
//       const pricePerLitre = getPriceForDate(history, entry.date);
//       const litres = entry.amountML / 1000;
//       const cost = litres * pricePerLitre;

//       totalML += entry.amountML;
//       totalAmount += cost;
//     });

//     res.json({
//       msg: "Monthly summary fetched",
//       month,
//       year,
//       totalML,
//       totalLitres: totalML / 1000,
//       totalAmount,
//       entries,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };
exports.getMonthlySummary = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { month, year } = req.query;

    if (!month || !year)
      return res.status(400).json({ msg: "month & year required" });


      const customer = await Customer.findById(customerId);
      if (!customer) return res.status(404).json({ msg: "Customer not found" });

    // ---------------------------------------------
    // ROLE-BASED ACCESS CONTROL (Option A)
    // ---------------------------------------------
    //
    // Allowed:
    // 1) Customer → only if accessing their own ID
    // 2) Shopkeeper (admin) → access ANY customer
    //
    // Not allowed:
    // Vendor → should NEVER access this route
    //

    if (req.user.role === "customer") {
      if (req.user.id !== customerId) {
        console.log("comming from first if else of getmothly summary");
        
        return res.status(403).json({ msg: "Access denied" });
      }
    }

    if (req.user.role === "vendor") {
      return res.status(403).json({ msg: "Vendors are not allowed to view monthly summaries" });
    }

    // ---------------------------------------------
    // Fetch milk entries for the month
    // ---------------------------------------------

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await MilkEntry.find({
      customer: customerId,
      date: { $gte: start, $lt: end },
    })
      .populate("vendor", "name") // populated for admin
      .sort({ date: 1 })
      .lean();

    // ---------------------------------------------
    // Price history
    // ---------------------------------------------
    const settings = await Settings.findOne({ key: "milk_price_history" });
    // const history = settings?.value || [];
    // pick history based on customer milk type
const milkType = customer.milkType;
const history = settings?.value?.[milkType] || [];


    const getPriceForDate = (priceHistory, date) => {
      const sorted = [...priceHistory].sort(
        (a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom)
      );

      let price = sorted[0]?.price || 0;

      for (let entry of sorted) {
        if (new Date(date) >= new Date(entry.effectiveFrom)) {
          price = entry.price;
        }
      }
      return price;
    };

    // ---------------------------------------------
    // Build daily breakdown
    // ---------------------------------------------
    let totalML = 0;
    let totalAmount = 0;

    const daily = entries.map((e) => {
      const litres = e.amountML / 1000;
      const price = getPriceForDate(history, e.date);
      const amount = litres * price;

      totalML += e.amountML;
      totalAmount += amount;

      return {
        date: e.date,
        litres,
        vendor: e.vendor?.name || null, // only admin sees this
        pricePerLitre: price,
        amount,
      };
    });

    return res.json({
      msg: "Monthly summary fetched",
      month,
      year,
      totalLitres: +(totalML / 1000).toFixed(3),
      totalAmount: +totalAmount.toFixed(2),
      daily,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


// -------------------------------------------------------------
// 2) Customer monthly calendar (entries day-wise)
// -------------------------------------------------------------
exports.getCalendar = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { month, year } = req.query;

    if (req.user.id !== customerId)
                // console.log("comming from first if else of getcalendar");

      return res.status(403).json({ msg: "Access denied" });

    if (!month || !year)
      return res.status(400).json({ msg: "month & year required" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await MilkEntry.find({
      customer: customerId,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    res.json({
      msg: "Calendar data fetched",
      entries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
