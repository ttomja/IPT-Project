// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
    productName: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, trim: true, default: "" },
    unitOfMeasure: { type: String, required: true, trim: true },
    quantityInStock: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
