const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("connect", () => {
  console.log("🟢 Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("🔴 Redis connection error:", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
