const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "BRANCH_MANAGER", "SALES_MANAGER", "SERVICE_STAFF"],
      required: true,
    },
    branch: { type: String, required: true },
    department: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Resigned", "Terminated"],
      default: "Active",
    },
    joinDate: { type: String, default: "" },
    salesTarget: { type: Number, default: 0 },
    salesAchieved: { type: Number, default: 0 },
    attendance: { type: Number, default: 100 },
    onboardingStatus: {
      type: String,
      enum: ["COMPLETED", "VERIFICATION_PENDING", "DOCUMENT_SUBMISSION", "PENDING"],
      default: "PENDING",
    },
    offboardingStatus: {
      type: String,
      enum: ["NONE", "INITIATED", "IN_PROGRESS", "COMPLETED"],
      default: "NONE",
    },
    documents: [
      {
        name: String,
        type: String,
        status: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate employee ID before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model("Employee").countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);
