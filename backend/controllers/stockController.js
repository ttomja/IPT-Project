const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
async function stockIn(req, res) {
  try {
    const { productId, quantity, remarks } = req.body;
    const qty = Number(quantity);
    if (!productId) {
      return res.status(400).json({ message: "Product is required." });
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }
    const product = await Product.findById(productId);
    if (!product || product.status !== "Active") {
      return res.status(404).json({ message: "Active product not found." });
    }
    const previousQuantity = product.quantityInStock;
    const newQuantity = previousQuantity + qty;
    product.quantityInStock = newQuantity;
    await product.save();
    const transaction = await StockTransaction.create({
      productId: product._id,
      transactionType: "Stock In",
      quantity: qty,
      previousQuantity,
      newQuantity,
      processedBy: req.user._id,
      remarks,
    });
    res.status(201).json({
      message: "Stock-in recorded successfully.",
      transaction,
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to record stock-in.", error: error.message });
  }
}
async function stockOut(req, res) {
  try {
    const { productId, quantity, remarks } = req.body;
    const qty = Number(quantity);
    if (!productId) {
      return res.status(400).json({ message: "Product is required." });
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }
    const product = await Product.findById(productId);
    if (!product || product.status !== "Active") {
      return res.status(404).json({ message: "Active product not found." });
    }
    if (product.quantityInStock < qty) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }
    const previousQuantity = product.quantityInStock;
    const newQuantity = previousQuantity - qty;
    product.quantityInStock = newQuantity;
    await product.save();
    const transaction = await StockTransaction.create({
      productId: product._id,
      transactionType: "Stock Out",
      quantity: qty,
      previousQuantity,
      newQuantity,
      processedBy: req.user._id,
      remarks,
    });
    res.status(201).json({
      message: "Stock-out recorded successfully.",
      transaction,
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to record stock-out.", error: error.message });
  }
}
async function getTransactions(req, res) {
  try {
    const { type, productId } = req.query;
    const filter = {};
    if (type && type !== "All") {
      filter.transactionType = type;
    }
    if (productId) {
      filter.productId = productId;
    }
    const transactions = await StockTransaction.find(filter)
      .populate("productId", "productCode productName")
      .populate("processedBy", "fullName username")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Unable to load transactions.", error: error.message });
  }
}
module.exports = {
  stockIn,
  stockOut,
  getTransactions,
};
