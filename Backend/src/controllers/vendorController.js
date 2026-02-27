const Customer = require("../models/Customer");
const MilkEntry = require("../models/MilkEntry");
const Area = require("../models/Area");

// -------------------------------------------------------------
// 1) Get customers by area & subarea
// -------------------------------------------------------------
exports.getCustomersByArea = async (req, res) => {
  try {
    const { area, subarea } = req.query;

    console.log("📍 Fetching customers - area:", area, "subarea:", subarea);

    if (!area) return res.status(400).json({ msg: "Area is required" });

    // Validate area exists
    const areaExists = await Area.findById(area);
    if (!areaExists) return res.status(404).json({ msg: "Area not found" });

    // First, let's see ALL customers in this area
    const allCustomersInArea = await Customer.find({ area }).lean();
    console.log(`📊 Total customers in area: ${allCustomersInArea.length}`);

    if (allCustomersInArea.length > 0) {
      console.log("🏢 Building_Name values in this area:");
      allCustomersInArea.forEach((c, idx) => {
        console.log(`  ${idx + 1}. "${c.Building_Name}" (customer: ${c.name})`);
      });
    }

    const filter = { area };
    if (subarea) filter.subarea = subarea;

    console.log("🔍 Filter being used:", JSON.stringify(filter));

    const customers = await Customer.find(filter).sort({ name: 1 });

    console.log(`✅ Found ${customers.length} customers matching filter`);
    if (customers.length > 0) {
      console.log("Sample customer:", customers[0]);
    }

    res.json({
      msg: "Customers fetched successfully",
      customers,
    });
  } catch (err) {
    console.error("❌ Error in getCustomersByArea:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------------------------------------------------
// 2) Get calendar data for a customer (monthly entries)
// -------------------------------------------------------------
exports.getCustomerCalendar = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { month, year } = req.query; // month = 1-12

    if (!month || !year)
      return res.status(400).json({ msg: "month & year are required" });

    // 1️⃣ Fetch customer once
    const customer = await Customer.findById(customerId).select("name");
    if (!customer)
      return res.status(404).json({ msg: "Customer not found" });

    // 2️⃣ Month range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // 3️⃣ Fetch entries
    const entries = await MilkEntry.find({
      customer: customerId,
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: 1 });

    // 4️⃣ Response
    res.json({
      msg: "Calendar data fetched",
      customerName: customer.name,   // ✅ added
      entries,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// -------------------------------------------------------------
// 3) Create or Update milk entry
// -------------------------------------------------------------
// exports.createOrUpdateMilkEntry = async (req, res) => {
//   try {
//     const { customerId, date, amount, unit } = req.body;
//     const vendorId = req.user.id;

//     if (!customerId || !date || !amount || !unit) {
//       return res.status(400).json({
//         msg: "customerId, date, amount & unit are required",
//       });
//     }



//     // 1. Convert date & validate no future date
//     const entryDate = new Date(date);
//     const today = new Date();

//     // Normalize dates (remove hours)
//     entryDate.setHours(0, 0, 0, 0);
//     today.setHours(0, 0, 0, 0);

//     if (entryDate > today)
//       return res.status(400).json({ msg: "Future dates not allowed" });

//     // 2. Convert L → ML
//     let amountML = amount;
//     if (unit === "L" || unit === "l") {
//       amountML = amount * 1000;
//     }

//     // 3. Upsert (create or update)
//     const updatedEntry = await MilkEntry.findOneAndUpdate(
//       { customer: customerId, date: entryDate },
//       {
//         $set: {
//           vendor: vendorId,
//           amountML,
//         },
//       },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({
//       msg: "Milk entry saved successfully",
//       entry: updatedEntry,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.createOrUpdateMilkEntry = async (req, res) => {
  try {
    const { customerId, date, amount, unit } = req.body;
    const vendorId = req.user.id;

    if (!customerId || !date || !amount || !unit) {
      return res.status(400).json({
        msg: "customerId, date, amount & unit are required",
      });
    }

    // Fetch customer to determine milkType
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ msg: "Customer not found" });

    const milkType = customer.milkType;  // ⭐ IMPORTANT

    // 1. Convert date & validate no future date
    const entryDate = new Date(date);
    const today = new Date();

    entryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (entryDate > today)
      return res.status(400).json({ msg: "Future dates not allowed" });

    // 2. Convert L → ML
    let amountML = amount;
    if (unit.toLowerCase() === "l") {
      amountML = amount * 1000;
    }

    // 3. Check if entry exists
    let entry = await MilkEntry.findOne({
      customer: customerId,
      date: entryDate,
    });

    if (entry) {
      // UPDATE existing entry
      entry.amountML = amountML;
      entry.vendor = vendorId;
      entry.milkType = milkType; // ⭐ always correct based on customer
      await entry.save();

      return res.json({
        msg: "Milk entry updated successfully",
        entry,
      });
    }

    // 4. CREATE new entry
    entry = await MilkEntry.create({
      customer: customerId,
      vendor: vendorId,
      amountML,
      date: entryDate,
      milkType, // ⭐ auto-applied
    });

    res.status(201).json({
      msg: "Milk entry created successfully",
      entry,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
