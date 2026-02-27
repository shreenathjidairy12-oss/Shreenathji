const Staff = require("../models/Staff");
const Customer = require("../models/Customer");
const Area = require("../models/Area");
const bcrypt = require("bcryptjs");

// CREATE VENDOR (shopkeeper only)
exports.createVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "name,email,password required" });

    // check if email exists
    const existing = await Staff.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const vendor = await Staff.create({ name, email, password: hashed, role: "vendor" });

    res.status(201).json({ msg: "Vendor created", vendor: { id: vendor._id, name: vendor.name, email: vendor.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// CREATE CUSTOMER (shopkeeper only)
exports.createCustomer = async (req, res) => {
  try {
    const { name, mobile, area, subarea, milkType } = req.body;

    if (!name || !mobile || !area || !milkType)
      return res.status(400).json({ msg: "name, mobile, area, milkType required" });

    // Validate milkType
    if (!["cow", "buffalo"].includes(milkType))
      return res.status(400).json({ msg: "milkType must be cow or buffalo" });

    // Validate mobile
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile))
      return res.status(400).json({ msg: "Invalid mobile number" });

    const exists = await Customer.findOne({ mobile });
    if (exists)
      return res.status(400).json({ msg: "Mobile already registered" });

    // Validate area
    const areaDoc = await Area.findById(area);
    if (!areaDoc)
      return res.status(400).json({ msg: "Area not found" });

    // Create customer
    const customer = await Customer.create({
      name,
      mobile,
      area,
      subarea: subarea || "",
      milkType,
      createdBy: req.user.id
    });

    return res.status(201).json({
      msg: "Customer created",
      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        milkType: customer.milkType
      }
    });

  } catch (err) {
    console.error(err);
    console.log('coming from customer creation block');

    return res.status(500).json({ msg: "Server error" });
  }
};


