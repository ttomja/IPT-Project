const Product = require("../models/Product");
const Category = require("../models/Category");
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
    if (Number(quantityInStock) < 0 || Number(reorderLevel) < 0 || Number(price) < 0) {
      return res.status(400).json({ message: "Numeric values cannot be negative." });
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
    if (req.body.quantityInStock !== undefined && Number(req.body.quantityInStock) < 0) {
      return res.status(400).json({ message: "Numeric values cannot be negative." });
    }
    if (req.body.reorderLevel !== undefined && Number(req.body.reorderLevel) < 0) {
      return res.status(400).json({ message: "Numeric values cannot be negative." });
    }
    if (req.body.price !== undefined && Number(req.body.price) < 0) {
      return res.status(400).json({ message: "Numeric values cannot be negative." });
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
