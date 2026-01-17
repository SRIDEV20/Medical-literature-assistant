const express = require("express");
const Feedback = require("../models/feedback.model");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /api/feedback
 * 🔐 Protected route (JWT required)
 * Body: { queryId, helpful }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { queryId, helpful } = req.body;

    // Basic validation
    if (!queryId || typeof helpful !== "boolean") {
      return res.status(400).json({
        error: "Invalid feedback payload",
      });
    }

    await Feedback.create({
      queryId,
      helpful,
    });

    return res.status(201).json({
      status: "stored",
    });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({
      error: "Failed to store feedback",
    });
  }
});

module.exports = router;
