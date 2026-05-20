const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: [true, "Product code is required."],
      unique: true,
      uppercase: true,
      trim: true
    },
    productName: {
      type: String,
      required: [true, "Product name is required."],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    unitOfMeasure: {
      type: String,
      required: [true, "Unit of measure is required."],
      trim: true
    },
    quantityInStock: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative."]
    },
    reorderLevel: {
      type: Number,
      default: 0,
      min: [0, "Reorder level cannot be negative."]
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative."]
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
