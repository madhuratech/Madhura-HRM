const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeName: { type: String, default: "" },
    date: { type: String, required: true }, // YYYY-MM-DD
    punchIn: { type: Date },
    punchOut: { type: Date },
    hoursWorked: { type: Number, default: 0 },
    latitude: { type: Number },
    longitude: { type: Number },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE", "HOLIDAY"],
      default: "PRESENT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
