const Product = require("../models/Product");
const Category = require("../models/Category");
const { isZeroOrPositiveNumber } = require("../utils/validators");
async function getProducts(req, res) {
  const { search, categoryId } = req.query;
  const filter = { status: "Active" };
  if (categoryId && categoryId !== "All") {
    filter.categoryId = categoryId;
  }
  if (search) {
    filter.$or = [
      { productCode: { $regex: search, $options: "i" } },
      { productName: { $regex: search, $options: "i" } },
    ];
  }
  const products = await Product.find(filter)
    .populate("categoryId", "categoryName")
    .sort({ productName: 1 });
  res.json(products);
}
async function createProduct(req, res) {
  try {
    const {
      productCode,
      productName,
      categoryId,
      description,
      unitOfMeasure,
      quantityInStock = 0,
      reorderLevel = 0,
      price = 0,
    } = req.body;
    if (!productCode || !productName || !categoryId || !unitOfMeasure) {
      return res.status(400).json({ message: "Product code, name, category, and unit are required." });
    }
    const existingProduct = await Product.findOne({ productCode: productCode.trim() });
    if (existingProduct) {
      return res.status(400).json({ message: "Product code already exists." });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Selected category does not exist." });
    }
    if (!isZeroOrPositiveNumber(quantityInStock) || !isZeroOrPositiveNumber(reorderLevel) || !isZeroOrPositiveNumber(price)) {
      return res.status(400).json({ message: "Quantity, reorder level, and price must be valid non-negative numbers." });
    }
    const product = await Product.create({
      productCode: productCode.trim(),
      productName: productName.trim(),
      categoryId,
      description,
      unitOfMeasure,
      quantityInStock: Number(quantityInStock),
      reorderLevel: Number(reorderLevel),
      price: Number(price),
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Unable to create product.", error: error.message });
  }
}
async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    if (req.body.productCode) {
      const duplicateProduct = await Product.findOne({
        productCode: req.body.productCode.trim(),
        _id: { $ne: req.params.id },
      });
      if (duplicateProduct) {
        return res.status(400).json({ message: "Product code already exists." });
      }
    }
    if (req.body.quantityInStock !== undefined && !isZeroOrPositiveNumber(req.body.quantityInStock)) {
      return res.status(400).json({ message: "Quantity must be a valid non-negative number." });
    }
    if (req.body.reorderLevel !== undefined && !isZeroOrPositiveNumber(req.body.reorderLevel)) {
      return res.status(400).json({ message: "Reorder level must be a valid non-negative number." });
    }
    if (req.body.price !== undefined && !isZeroOrPositiveNumber(req.body.price)) {
      return res.status(400).json({ message: "Price must be a valid non-negative number." });
    }
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Unable to update product.", error: error.message });
  }
}
async function deactivateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  product.status = "Inactive";
  await product.save();
  res.json({ message: "Product deactivated successfully." });
}
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
};
