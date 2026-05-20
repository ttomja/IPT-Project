const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
async function stockIn(req, res) {
  const { productId, quantity, remarks } = req.body;
  const qty = Number(quantity);
  if (!productId || !qty || qty <= 0) {
    return res.status(400).json({ message: "Valid product and quantity are required." });
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
    message: "Stock-in transaction recorded successfully.",
    product,
    transaction,
  });
}
async function stockOut(req, res) {
  const { productId, quantity, remarks } = req.body;
  const qty = Number(quantity);
  if (!productId || !qty || qty <= 0) {
    return res.status(400).json({ message: "Valid product and quantity are required." });
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
    message: "Stock-out transaction recorded successfully.",
    product,
    transaction,
  });
}
async function getTransactions(req, res) {
  const transactions = await StockTransaction.find()
    .populate("productId", "productCode productName")
    .populate("processedBy", "fullName username")
    .sort({ createdAt: -1 });
  res.json(transactions);
}
module.exports = {
  stockIn,
  stockOut,
  getTransactions,
};
