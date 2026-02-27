const Staff = require("../models/Staff");
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email & Password required" });

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ msg: "Staff not found" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: staff._id, role: staff.role,   // ADD THIS
 }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      msg: "Login successful",
      token,
      staff: { id: staff._id, name: staff.name, email: staff.email, role: staff.role }
    });
  } catch (err) {
    console.error(err);
    console.log("coming from staff login ");
    
    res.status(500).json({ msg: "Server error " });
  }
};

exports.customerLogin = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ msg: "Mobile required" });

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) return res.status(400).json({ msg: "Invalid mobile number" });

    const customer = await Customer.findOne({ mobile });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    const token = jwt.sign({ id: customer._id, role: "customer" ,name :customer.name}, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      msg: "Login successful",
      token,
      customer: { id: customer._id, name: customer.name, mobile: customer.mobile, area: customer.area, subarea: customer.subarea }
    });
  } catch (err) {
    console.error(err);
    console.log("coming from customer login");
    res.status(500).json({ msg: "Server error" });
  }
};


