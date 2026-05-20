const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
async function getCurrentInventoryReport(req, res) {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("categoryId", "categoryName")
      .sort({ productName: 1 });
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Unable to load inventory report." });
  }
}
async function getLowStockReport(req, res) {
  try {
    const products = await Product.find({
      status: "Active",
      $expr: { $lte: ["$quantityInStock", "$reorderLevel"] },
    }).populate("categoryId", "categoryName");
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Unable to load low-stock report." });
  }
}
async function getStockInReport(req, res) {
  try {
    const transactions = await StockTransaction.find({ transactionType: "Stock In"
      })
      .populate("productId", "productCode productName")
      .populate("processedBy", "fullName username")
      .sort({ createdAt: -1 });
    res.json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: "Unable to load stock-in report." });
  }
}
async function getStockOutReport(req, res) {
  try {
    const transactions = await StockTransaction.find({ transactionType: "Stock Out" })
      .populate("productId", "productCode productName")
      .populate("processedBy", "fullName username")
      .sort({ createdAt: -1 });
    res.json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: "Unable to load stock-out report." });
  }
}
module.exports = {
  getCurrentInventoryReport,
  getLowStockReport,
  getStockInReport,
  getStockOutReport,
};
