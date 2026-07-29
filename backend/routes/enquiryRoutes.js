const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

// @route   GET /api/enquiries
router.get("/", async (req, res) => {
  try {
    const { status, assignedTo, branch, search } = req.query;
    const filter = {};

    if (status && status !== "ALL") filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (branch) filter.branch = branch;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { modelInterest: { $regex: search, $options: "i" } },
      ];
    }

    const enquiries = await Enquiry.find(filter)
      .populate("assignedTo", "name employeeId")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries", error: error.message });
  }
});

// @route   POST /api/enquiries
router.post("/", async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ message: "Failed to create enquiry", error: error.message });
  }
});

// @route   PUT /api/enquiries/:id
router.put("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ message: "Failed to update enquiry", error: error.message });
  }
});

// @route   POST /api/enquiries/:id/remarks
// @desc    Add a remark to an enquiry
router.post("/:id/remarks", async (req, res) => {
  try {
    const { text, addedBy } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    enquiry.remarks.push({
      date: new Date().toISOString().split("T")[0],
      text,
      addedBy,
    });
    enquiry.lastContact = new Date().toISOString().split("T")[0];
    await enquiry.save();

    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ message: "Failed to add remark", error: error.message });
  }
});

// @route   DELETE /api/enquiries/:id
router.delete("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete enquiry", error: error.message });
  }
});

module.exports = router;
