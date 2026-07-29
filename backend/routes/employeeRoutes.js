const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// @route   GET /api/employees
// @desc    Get all employees (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { role, branch, status, search } = req.query;
    const filter = {};

    if (role && role !== "ALL") filter.role = role;
    if (branch && branch !== "ALL") filter.branch = branch;
    if (status && status !== "ALL") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error: error.message });
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee", error: error.message });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }
    res.status(500).json({ message: "Failed to create employee", error: error.message });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to update employee", error: error.message });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error: error.message });
  }
});

// @route   GET /api/employees/stats/summary
// @desc    Get employee stats for dashboard
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: "Active" });
    const onLeave = await Employee.countDocuments({ status: "On Leave" });
    const roles = await Employee.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const branches = await Employee.aggregate([
      { $group: { _id: "$branch", count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { total, active, onLeave, roles, branches } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

module.exports = router;
