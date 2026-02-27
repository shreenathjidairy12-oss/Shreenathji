const Settings = require("../models/Settings");

exports.updateMilkPrice = async (req, res) => {
  try {
    const { type, price } = req.body;

    // Validate milk type
    if (!["cow", "buffalo"].includes(type)) {
      return res.status(400).json({ msg: "type must be cow or buffalo" });
    }

    // Validate price
    if (price === undefined || price === null) {
      return res.status(400).json({ msg: "price is required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        msg: "price must be a positive number",
      });
    }

    let settings = await Settings.findOne({ key: "milk_price_history" });

    // Create settings doc if not exists
    if (!settings) {
      settings = await Settings.create({
        key: "milk_price_history",
        value: { cow: [], buffalo: [] },
      });
    }

    // Ensure structure exists (extra safety)
    if (!settings.value[type]) {
      settings.value[type] = [];
    }

    // Get previous price (if any)
    const previousPriceEntry =
      settings.value[type].length > 0
        ? settings.value[type][settings.value[type].length - 1]
        : null;

    const previousPrice = previousPriceEntry
      ? previousPriceEntry.price
      : null;

    // Effective from next day
    const effectiveFrom = new Date();
    effectiveFrom.setDate(effectiveFrom.getDate() + 1);
    effectiveFrom.setHours(0, 0, 0, 0);

    // Push new price
    settings.value[type].push({
      price,
      effectiveFrom,
    });

    // IMPORTANT for Mixed type
    settings.markModified("value");
    await settings.save();

    return res.json({
      msg: `${type} milk price updated successfully`,
      milkType: type,
      oldPrice: previousPrice,        // 👈 informative
      newPrice: price,
      effectiveFrom,
    });

  } catch (err) {
    console.error("Milk price update error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
