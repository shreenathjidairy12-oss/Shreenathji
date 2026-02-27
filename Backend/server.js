// server.js (backend root)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// const areaRoutes = require("./routes/areaRoutes");


const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL || "https://dairy-farm-black.vercel.app"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));


// connect DB and routes (keep your existing requires)
connectDB();

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/staff", require("./src/routes/staffRoutes"));
app.use("/api/customers", require("./src/routes/customerRoutes"));
app.use("/api/settings", require("./src/routes/settingsRoutes"));
app.use("/api/pdf", require("./src/routes/pdfRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));


// const billingRoutes = require("./routes/billingRoutes");
app.use("/api/billing", require("./src/routes/billingRoutes"));



// one-time setup route for initial shopkeeper creation
app.use("/api/setup", require("./src/routes/setupRoutes"));


app.get("/", (req, res) => res.send("Dairy backend running"));





//seperate for the POS system 
app.use("/api/pos/items", require("./src/pos/routes/itemRoutes"));
app.use("/api/pos/bills", require("./src/pos/routes/billRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));