const MilkEntry = require("../models/MilkEntry");
const Settings = require("../models/Settings");
const Customer = require("../models/Customer");
const pdfService = require("../services/pdfService");

// helper: determine price for a date (same logic as earlier)
const getPriceForDate = (priceHistory, date) => {
  const sorted = [...priceHistory].sort(
    (a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom)
  );

  let applicable = sorted[0]?.price || 0;
  for (let i = 0; i < sorted.length; i++) {
    if (new Date(date) >= new Date(sorted[i].effectiveFrom)) {
      applicable = sorted[i].price;
    }
  }
  return applicable;
};

exports.generateMonthlyBill = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { month, year } = req.query;

    // ensure customer is requesting own bill
    if (req.user.id !== customerId)
        // console.log('coming from ifelse of gemerate monthly bill fi');
        
      return res.status(403).json({ msg: "Access denied" });

    if (!month || !year)
      return res.status(400).json({ msg: "month & year are required (month 1-12)" });

    // verify customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    // fetch entries
    const entries = await MilkEntry.find({
      customer: customerId,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 }).lean();

    // fetch price history
    const settings = await Settings.findOne({ key: "milk_price_history" });
    const history = settings?.value || [];

    // prepare line items
    const lineItems = entries.map(e => {
    //   const pricePerLitre = getPriceForDate(history, e.date);
    const milkType = customer.milkType;
const priceHistory = settings.value[milkType];
const pricePerLitre = getPriceForDate(priceHistory, e.date);

      const litres = e.amountML / 1000;
      const amount = +(litres * pricePerLitre).toFixed(2);
      return {
        date: e.date,
        litres,
        pricePerLitre,
        amount,
      };
    });

    // totals
    const totalLitres = lineItems.reduce((s, it) => s + it.litres, 0);
    const totalAmount = +lineItems.reduce((s, it) => s + it.amount, 0).toFixed(2);

    // invoice metadata
    const invoiceData = {
      customer: {
        id: customer._id.toString(),
        name: customer.name,
        mobile: customer.mobile,
        area: customer.area,
        subarea: customer.subarea,
      },
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      lineItems,
      totalLitres: +totalLitres.toFixed(3),
      totalAmount,
      generatedAt: new Date(),
    };

    // create PDF buffer
    const pdfBuffer = await pdfService.generateInvoiceBuffer(invoiceData);

    // send PDF
    const fileName = `invoice_${customer.name.replace(/\s+/g,'_')}_${month}-${year}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ msg: "Server error while generating PDF" });
  }
};
