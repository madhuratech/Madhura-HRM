const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// @route   GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const { status, assignedTo, priority } = req.query;
    const filter = {};

    if (status && status !== "ALL") filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name employeeId")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// @route   GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name employeeId");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task", error: error.message });
  }
});

// @route   POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
});

// @route   PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    if (req.body.status === "COMPLETED" && !req.body.completedAt) {
      req.body.completedAt = new Date();
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = router;
