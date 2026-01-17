const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email }
 */
router.post("/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  // Mock user (no DB yet)
  const token = jwt.sign(
    { email, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
