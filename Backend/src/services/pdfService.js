const PDFDocument = require("pdfkit");

// Try to decode base64-like strings safely
function decodeIfEncoded(value) {
  if (!value || typeof value !== "string") return value;

  try {
    // simple base64 detection
    const isBase64 =
      /^[A-Za-z0-9+/=]+$/.test(value) && value.length % 4 === 0;

    if (!isBase64) return value;

    const decoded = Buffer.from(value, "base64").toString("utf8");

    // if decoded looks readable, use it
    if (/[\w\s]/.test(decoded)) {
      return decoded.trim();
    }

    return value;
  } catch {
    return value;
  }
}

// returns Promise<Buffer>
exports.generateInvoiceBuffer = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageBottom = 760;

      const area = decodeIfEncoded(invoiceData.customer.area);
      console.log(area)
      const subarea = decodeIfEncoded(invoiceData.customer.subarea);

      /* ===========================
         HEADER BAR (ROYAL BLUE)
      =========================== */

      doc.rect(0, 0, doc.page.width, 80).fill("#0b3d91"); // royal blue
      doc.fillColor("#ffffff");

      doc.font("Helvetica-Bold")
        .fontSize(20)
        .text("ShreenathJi Dairy", 40, 28);

      doc.font("Helvetica")
        .fontSize(10)
        .text(
          "Kareli Baug | Dandiya Bajar | Contact: 9999999999",
          40,
          52
        );

      doc.text(
        `Invoice ${invoiceData.month}/${invoiceData.year}`,
        0,
        35,
        { align: "right" }
      );

      doc.fillColor("#000");
      doc.y = 100;

      /* ===========================
         CUSTOMER / META BOX
      =========================== */

      const infoTop = doc.y;

      doc.rect(40, infoTop, 515, 72).fill("#eef3ff"); // light royal blue tint
      doc.fillColor("#000");

      doc.font("Helvetica-Bold").fontSize(11);
      doc.text("Customer Details", 50, infoTop + 8);

      doc.font("Helvetica").fontSize(10);
      doc.text(`Name : ${invoiceData.customer.name}`, 50, infoTop + 24);
      doc.text(`Mobile : ${invoiceData.customer.mobile}`, 50, infoTop + 38);

      let infoLine = 52;

      if (invoiceData?.customer?.area) {
        doc.text(`Area : ${invoiceData.customer.area}`, 50, infoTop + infoLine);
        infoLine += 14;
      }

      if (subarea) {
        doc.text(`Subarea : ${subarea}`, 50, infoTop + infoLine);
      }

      doc.font("Helvetica-Bold").text("Invoice Info", 350, infoTop + 8);
      doc.font("Helvetica");

      doc.text(
        `Generated : ${invoiceData.generatedAt.toLocaleString()}`,
        350,
        infoTop + 26,
        { width: 190 }
      );

      doc.y = infoTop + 92;

      /* ===========================
         TABLE HEADER
      =========================== */

      const drawTableHeader = () => {
        const y = doc.y;

        doc.rect(40, y, 515, 22).fill("#dbe7ff"); // royal blue tint
        doc.fillColor("#000");

        doc.font("Helvetica-Bold").fontSize(10);
        doc.text("Date", 50, y + 6);
        doc.text("Litres", 210, y + 6, { width: 60, align: "right" });
        doc.text("Rate / L", 310, y + 6, { width: 80, align: "right" });
        doc.text("Amount", 430, y + 6, { width: 80, align: "right" });

        doc.font("Helvetica");
        doc.y = y + 26;
      };

      drawTableHeader();

      /* ===========================
         TABLE ROWS
      =========================== */

      let rowY = doc.y;

      invoiceData.lineItems.forEach((item, index) => {

        if (rowY > pageBottom - 20) {
          doc.addPage();
          rowY = 40;
          doc.y = rowY;
          drawTableHeader();
          rowY = doc.y;
        }

        if (index % 2 === 0) {
          doc.rect(40, rowY - 2, 515, 18).fill("#f4f7ff");
          doc.fillColor("#000");
        }

        const dateStr = new Date(item.date).toLocaleDateString();

        doc.fontSize(10);
        doc.text(dateStr, 50, rowY);
        doc.text(item.litres.toFixed(3), 210, rowY, { width: 60, align: "right" });
        doc.text(item.pricePerLitre.toFixed(2), 310, rowY, { width: 80, align: "right" });
        doc.text(item.amount.toFixed(2), 430, rowY, { width: 80, align: "right" });

        rowY += 18;
        doc.y = rowY;
      });

      /* ===========================
         TOTAL BOX
      =========================== */

      if (doc.y > pageBottom - 90) {
        doc.addPage();
      }

      const boxTop = doc.y + 10;

      doc.roundedRect(330, boxTop, 225, 60, 4).stroke("#0b3d91");

      doc.font("Helvetica-Bold").fontSize(11);
      doc.text("Total Litres", 340, boxTop + 12);
      doc.text(
        invoiceData.totalLitres.toFixed(3),
        470,
        boxTop + 12,
        { width: 60, align: "right" }
      );

      doc.fontSize(13);
      doc.text("Total Amount", 400, boxTop + 34);
      doc.text(
        `₹ ${invoiceData.totalAmount.toFixed(2)}`,
        450,
        boxTop + 34,
        { width: 90, align: "right" }
      );



      /* ===========================
   FOOTER  (CENTER FIXED)
=========================== */

doc.y = boxTop + 100;

doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke("#0b3d91");
doc.fillColor("#000");
doc.moveDown(0.5);

// full width = 555 - 40 = 515
const footerWidth = 515;

doc.fontSize(9).text(
  "Note: Prices shown according to company's price history effective date.",
  40,
  doc.y,
  { width: footerWidth, align: "center" }
);

doc.moveDown(0.4);

doc.text(
  "Thank you for using our Dairy services.",
  40,
  doc.y,
  { width: footerWidth, align: "center" }
);

      doc.end();

    } catch (err) {
      reject(err);
    }
  });
};