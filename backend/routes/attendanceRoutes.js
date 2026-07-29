const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// @route   POST /api/attendance/punch
router.post("/punch", async (req, res) => {
  try {
    const { employeeId, punch_type, latitude, longitude } = req.body;

    if (!employeeId || !punch_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const today = new Date().toISOString().split("T")[0];
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    let attendance = await Attendance.findOne({ employeeId, date: today });

    if (punch_type === "IN") {
      if (attendance && attendance.punchIn) {
        return res.status(400).json({ message: "Already punched in today" });
      }
      attendance = await Attendance.create({
        employeeId,
        employeeName: employee.name,
        date: today,
        punchIn: new Date(),
        latitude,
        longitude,
        status: "PRESENT",
      });
    } else if (punch_type === "OUT") {
      if (!attendance || !attendance.punchIn) {
        return res.status(400).json({ message: "No punch-in record found for today" });
      }
      const punchOutTime = new Date();
      const hoursWorked = ((punchOutTime - attendance.punchIn) / 3600000).toFixed(2);
      attendance.punchOut = punchOutTime;
      attendance.hoursWorked = parseFloat(hoursWorked);
      await attendance.save();
    }

    res.json({ success: true, message: `Punch ${punch_type} successful`, data: attendance });
  } catch (error) {
    res.status(500).json({ message: "Punch failed", error: error.message });
  }
});

// @route   GET /api/attendance/today/:employeeId
router.get("/today/:employeeId", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const record = await Attendance.findOne({ employeeId: req.params.employeeId, date: today });
    res.json({ success: true, data: record || null });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's record", error: error.message });
  }
});

// @route   GET /api/attendance/recent/:employeeId
router.get("/recent/:employeeId", async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.employeeId })
      .sort({ date: -1 })
      .limit(10);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
});

// @route   GET /api/attendance/all
// @desc    All employees attendance for today (for admin)
router.get("/all", async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];
    const records = await Attendance.find({ date: targetDate })
      .populate("employeeId", "name role branch")
      .sort({ punchIn: 1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
});

module.exports = router;
