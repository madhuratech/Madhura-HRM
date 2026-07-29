const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String, default: "" },
    issue: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    assignedName: { type: String, default: "" },
    date: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
