const Customer = require("../models/Customer");
const MilkEntry = require("../models/MilkEntry");
const Area = require("../models/Area");
const Staff = require("../models/Staff");
const customerController = require("./customerController");

// -------------------------------------------------------------
// 1) PAGINATED CUSTOMER LIST
// -------------------------------------------------------------
exports.getCustomersPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Fetch customers with pagination
    const customers = await Customer.find({})
      .populate("area", "name")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count
    const total = await Customer.countDocuments();

    // For each customer → get latest vendor entry
    for (let customer of customers) {
      const latestEntry = await MilkEntry.findOne({ customer: customer._id })
        .populate("vendor", "name")
        .sort({ date: -1 })
        .lean();

      customer.latestVendor = latestEntry?.vendor?.name || null;
      customer.latestLitres = latestEntry ? latestEntry.amountML / 1000 : 0;
      customer.latestDate = latestEntry ? latestEntry.date : null;
    }

    res.json({
      msg: "Customers fetched",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      customers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------------------------------------------------
// 2) SHOPKEEPER REUSES MONTHLY SUMMARY FROM CUSTOMER CONTROLLER
// -------------------------------------------------------------
exports.getCustomerMonthlyForAdmin = async (req, res) => {
  try {
    // Directly call customer summary controller but override access restriction
    req.user.role = "admin_view_override"; // mark as admin usage
    return customerController.getMonthlySummary(req, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------------------------------------------------
// 3) DAILY SUMMARY (vendor-wise + area-wise + total litres)
// -------------------------------------------------------------
exports.getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) return res.status(400).json({ msg: "date is required (YYYY-MM-DD)" });

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const next = new Date(target);
    next.setDate(next.getDate() + 1);

    // Fetch entries for that day
    const entries = await MilkEntry.find({
      date: { $gte: target, $lt: next }
    })
      .populate("customer", "name")
      .populate("vendor", "name")
      .lean();

    let totalLitres = 0;

    const vendorMap = {};
    const areaMap = {}; // kept same in case you want it later
    const customerList = [];

    for (let e of entries) {
      const litres = e.amountML / 1000;
      totalLitres += litres;

      // Vendor-wise aggregation
      if (e.vendor) {
        vendorMap[e.vendor.name] = (vendorMap[e.vendor.name] || 0) + litres;
      }

      // Area-wise aggregation (optional but already included)
      if (e.customer?.area) {
        const areaId = e.customer.area.toString();

        if (!areaMap[areaId]) {
          const areaDoc = await Area.findById(areaId).lean();
          areaMap[areaId] = {
            area: areaDoc?.name || "Unknown",
            litres: 0,
          };
        }

        areaMap[areaId].litres += litres;
      }

      // Minimal customer list (performance optimized)
      customerList.push({
        customerId: e.customer?._id,
        customerName: e.customer?.name || "Unknown",
        litres,
      });
    }

    return res.json({
      msg: "Daily summary generated",
      date,
      totalLitres,
      totalCustomersServed: entries.length,
      customers: customerList, // optimized minimal list
      vendorBreakdown: Object.entries(vendorMap).map(([vendor, litres]) => ({ vendor, litres })),
      areaBreakdown: Object.values(areaMap),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

