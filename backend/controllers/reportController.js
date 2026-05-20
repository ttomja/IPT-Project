const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");

async function getCurrentInventoryReport(req, res) {
  const products = await Product.find().populate("categoryId").sort({ createdAt: -1 });
  res.json(products);
}

async function getLowStockReport(req, res) {
  const products = await Product.find({ $expr: { $lte: ["$quantityInStock", "$reorderLevel"] } })
    .populate("categoryId")
    .sort({ createdAt: -1 });
  res.json(products);
}

async function getStockInReport(req, res) {
  const transactions = await StockTransaction.find({ transactionType: "Stock In" })
    .populate("productId")
    .sort({ createdAt: -1 });
  res.json(transactions);
}

async function getStockOutReport(req, res) {
  const transactions = await StockTransaction.find({ transactionType: "Stock Out" })
    .populate("productId")
    .sort({ createdAt: -1 });
  res.json(transactions);
}

module.exports = {
  getCurrentInventoryReport,
  getLowStockReport,
  getStockInReport,
  getStockOutReport
};
