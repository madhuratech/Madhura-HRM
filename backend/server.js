require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRM Backend Running ✅", status: "OK", timestamp: new Date() });
});

// API Routes
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/employees",  require("./routes/employeeRoutes"));
app.use("/api/sales",      require("./routes/salesRoutes"));
app.use("/api/enquiries",  require("./routes/enquiryRoutes"));
app.use("/api/tasks",      require("./routes/taskRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HRM Server running at http://localhost:${PORT}`);
});