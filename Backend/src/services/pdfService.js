const PDFDocument = require("pdfkit");

// returns Promise<Buffer>
exports.generateInvoiceBuffer = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- Header ---
      doc.fontSize(18).text("ShreenathJi Dairy ", { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(10).text("Kareli Baug | Dandiya Bajar | Contact: 9999999999", { align: "center" });
      doc.moveDown(0.8);
      doc.fontSize(12).text(`Invoice for: ${invoiceData.month}/${invoiceData.year}`, { align: "left" });
      doc.moveDown(0.3);

      // Customer info
      doc.fontSize(11).text(`Customer: ${invoiceData.customer.name}`);
      doc.text(`Mobile: ${invoiceData.customer.mobile}`);
      if (invoiceData.customer.area) doc.text(`Area: ${invoiceData.customer.area}`);
      if (invoiceData.customer.subarea) doc.text(`Subarea: ${invoiceData.customer.subarea}`);
      doc.moveDown(0.5);

      // meta
      doc.fontSize(10).text(`Generated on: ${invoiceData.generatedAt.toLocaleString()}`);
      doc.moveDown(0.5);

      // Table header
      const tableTop = doc.y + 10;
      const itemX = 40;
      const dateX = itemX;
      const litresX = 200;
      const rateX = 300;
      const amountX = 420;

      doc.fontSize(10).text("Date", dateX, tableTop, { bold: true });
      doc.text("Litres", litresX, tableTop);
      doc.text("Rate/L", rateX, tableTop);
      doc.text("Amount", amountX, tableTop);

      doc.moveDown(0.7);
      // Draw a line
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

      // Items
      invoiceData.lineItems.forEach((item) => {
        const y = doc.y + 6;
        const dateStr = new Date(item.date).toLocaleDateString();

        doc.fontSize(10).text(dateStr, dateX, y);
        doc.text(item.litres.toFixed(3), litresX, y, { width: 60, align: "right" });
        doc.text(item.pricePerLitre.toFixed(2), rateX, y, { width: 80, align: "right" });
        doc.text(item.amount.toFixed(2), amountX, y, { width: 80, align: "right" });
        doc.moveDown(1);
      });

      // Draw a line then totals
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(11).text(`Total Litres: ${invoiceData.totalLitres.toFixed(3)}`, { align: "left" });
      doc.fontSize(12).text(`Total Amount: ₹ ${invoiceData.totalAmount.toFixed(2)}`, { align: "right" });

      doc.moveDown(1.0);
      doc.fontSize(9).text("Note: Prices shown according to company's price history effective date.", { align: "left" });

      // Footer space
      doc.moveDown(2);
      doc.fontSize(9).text("Thank you for using our Dairy services.", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
