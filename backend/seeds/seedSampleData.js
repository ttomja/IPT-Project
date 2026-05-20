require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
async function seedSampleData() {
  await mongoose.connect(process.env.MONGO_URI);
  const office = await Category.findOneAndUpdate(
    { categoryName: "Office Supplies" },
    { categoryName: "Office Supplies", description: "Common office inventory items" },
    { upsert: true, new: true }
  );
  const cleaning = await Category.findOneAndUpdate(
    { categoryName: "Cleaning Supplies" },
    { categoryName: "Cleaning Supplies", description: "Cleaning and maintenance items" },
    { upsert: true, new: true }
  );
  await Product.findOneAndUpdate(
    { productCode: "P-001" },
    {
      productCode: "P-001",
      productName: "Bond Paper",
      categoryId: office._id,
      description: "A4 bond paper",
      unitOfMeasure: "Ream",
      quantityInStock: 10,
      reorderLevel: 5,
      price: 250,
      status: "Active",
    },
    { upsert: true, new: true }
  );
  await Product.findOneAndUpdate(
    { productCode: "P-002" },
    {
      productCode: "P-002",
      productName: "Alcohol",
      categoryId: cleaning._id,
      description: "Disinfecting alcohol",
      unitOfMeasure: "Bottle",
      quantityInStock: 8,
      reorderLevel: 3,
      price: 90,
      status: "Active",
    },
    { upsert: true, new: true }
  );
  console.log("Sample categories and products created.");
  await mongoose.disconnect();
}
seedSampleData();
