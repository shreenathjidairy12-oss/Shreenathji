const posDb = require("../../../config/posDb");
const Item = require("../models/Item");
const Bill = require("../models/Bill");

const generateBill = async (req, res) => {
  const session = await posDb.startSession();
  session.startTransaction();

  try {
    const { customerName, customerMobile, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      throw new Error("Customer name and items are required");
    }

    let billItems = [];
    let subTotal = 0;

    for (const i of items) {
      const item = await Item.findById(i.itemId).session(session);

      if (!item) {
        throw new Error("Item not found");
      }

      if (item.availableQty < i.quantity) {
        throw new Error(
          `Insufficient stock for ${item.name}. Available: ${item.availableQty}`
        );
      }

      const total = item.price * i.quantity;

      billItems.push({
        itemId: item._id,
        itemName: item.name,
        unitType: item.unitType,
        quantity: i.quantity,
        price: item.price, // snapshot
        total,
      });

      subTotal += total;

      // Deduct stock
      item.availableQty -= i.quantity;
      await item.save({ session });
    }

    const billNumber = `POS-${Date.now()}`;

    const bill = await Bill.create(
      [
        {
          customerName,
          customerMobile,
          items: billItems,
          subTotal,
          billNumber,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      msg: "Bill generated successfully",
      bill: bill[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      msg: err.message,
    });
  }
};

module.exports = { generateBill };
