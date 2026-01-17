const express = require("express");
const { redisClient } = require("../config/redis");

const router = express.Router();

router.get("/", async (req, res) => {
  let redisStatus = "down";

  try {
    const pong = await redisClient.ping();
    if (pong === "PONG") redisStatus = "up";
  } catch (err) {
    redisStatus = "down";
  }

  res.status(200).json({
    status: "ok",
    service: "medlens-backend",
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
