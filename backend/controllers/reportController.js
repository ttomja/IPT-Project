const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
async function getCurrentInventoryReport(req, res) {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("categoryId", "categoryName")
      .sort({ productName: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Unable to load inventory report." });
  }
}
async function getLowStockReport(req, res) {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("categoryId", "categoryName")
      .sort({ productName: 1 });
    const lowStockProducts = products.filter((product) => {
      return product.quantityInStock <= product.reorderLevel;
    });
    res.json(lowStockProducts);
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
    res.json(transactions);
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
    res.json(transactions);
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
