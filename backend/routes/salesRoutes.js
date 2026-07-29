const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

// @route   GET /api/sales
router.get("/", async (req, res) => {
  try {
    const { executiveId, branch, status, startDate, endDate } = req.query;
    const filter = {};

    if (executiveId) filter.executiveId = executiveId;
    if (branch) filter.branch = branch;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const sales = await Sale.find(filter)
      .populate("executiveId", "name employeeId branch")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales", error: error.message });
  }
});

// @route   GET /api/sales/stats/summary
router.get("/stats/summary", async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();
    const completed = await Sale.countDocuments({ status: "completed" });
    const pending = await Sale.countDocuments({ status: "pending" });

    const revenueAgg = await Sale.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const topModels = await Sale.aggregate([
      { $group: { _id: "$model", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({ success: true, data: { totalSales, completed, pending, totalRevenue, topModels } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

// @route   POST /api/sales
router.post("/", async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: "Failed to create sale", error: error.message });
  }
});

// @route   PUT /api/sales/:id
router.put("/:id", async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: "Failed to update sale", error: error.message });
  }
});

// @route   DELETE /api/sales/:id
router.delete("/:id", async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json({ success: true, message: "Sale deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete sale", error: error.message });
  }
});

module.exports = router;
