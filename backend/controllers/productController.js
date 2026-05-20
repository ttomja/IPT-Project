const Product = require("../models/Product");
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
  const {
    productCode,
    productName,
    categoryId,
    description,
    unitOfMeasure,
    quantityInStock,
    reorderLevel,
    price,
  } = req.body;
  if (!productCode || !productName || !categoryId || !unitOfMeasure) {
    return res.status(400).json({ message: "Required product fields are missing." });
  }
  const existingProduct = await Product.findOne({ productCode });
  if (existingProduct) {
    return res.status(400).json({ message: "Product code already exists." });
  }
  const product = await Product.create({
    productCode,
    productName,
    categoryId,
    description,
    unitOfMeasure,
    quantityInStock: Number(quantityInStock) || 0,
    reorderLevel: Number(reorderLevel) || 0,
    price: Number(price) || 0,
  });
  res.status(201).json(product);
}
async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  res.json(updatedProduct);
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
