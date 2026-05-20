const Category = require("../models/Category");
async function getCategories(req, res) {
  const categories = await Category.find({ status: "Active" }).sort({
    categoryName: 1,
  });
  res.json(categories);
}
async function createCategory(req, res) {
  const { categoryName, description } = req.body;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required." });
  }
  const existingCategory = await Category.findOne({ categoryName });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists." });
  }
  const category = await Category.create({ categoryName, description });
  res.status(201).json(category);
}
async function updateCategory(req, res) {
  const { categoryName, description, status } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }
  category.categoryName = categoryName ?? category.categoryName;
  category.description = description ?? category.description;
  category.status = status ?? category.status;
  const updatedCategory = await category.save();
  res.json(updatedCategory);
}
module.exports = {
  getCategories,
  createCategory,
  updateCategory,
};
