const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    model: { type: String, required: true },
    amount: { type: Number, required: true },
    executiveId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    executiveName: { type: String, default: "" },
    branch: { type: String, default: "" },
    paymentMode: {
      type: String,
      enum: ["Cash", "Finance", "Loan", "Card"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "pending",
    },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
