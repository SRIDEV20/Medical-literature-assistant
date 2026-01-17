const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const queryRoutes = require("./routes/query.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/health", healthRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);


module.exports = app;
