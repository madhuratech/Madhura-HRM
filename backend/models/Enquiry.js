const mongoose = require("mongoose");

const RemarkSchema = new mongoose.Schema({
  date: { type: String },
  text: { type: String },
  addedBy: { type: String },
});

const EnquirySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    modelInterest: { type: String, required: true },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "TEST_DRIVE", "QUOTATION", "CONVERTED", "LOST"],
      default: "NEW",
    },
    source: {
      type: String,
      enum: ["Walk-in", "Phone", "Online", "Referral", "Social Media"],
      default: "Walk-in",
    },
    lastContact: { type: String, default: "" },
    nextFollowUp: { type: String, default: "" },
    remarks: [RemarkSchema],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    branch: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
