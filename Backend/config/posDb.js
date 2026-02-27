const mongoose = require("mongoose");

const posDb = mongoose.createConnection(process.env.POS_DB_URI, {
  dbName: "dairy_pos_db", // 🔒 FORCE DB NAME
});

posDb.on("connected", () => {
  console.log("✅ POS Database connected");
  console.log("📦 POS DB Name:", posDb.name);
});

posDb.on("error", (err) => {
  console.error("❌ POS DB connection error:", err);
});

module.exports = posDb;
