const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    transactionType: {
      type: String,
      enum: ["Stock In", "Stock Out"],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1."]
    },
    previousQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    newQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    remarks: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);
