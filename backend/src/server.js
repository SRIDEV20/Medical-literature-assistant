require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1️⃣ Connect MongoDB FIRST
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB connected");

    // 2️⃣ Connect Redis
    await connectRedis();

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(`✅ MedLens backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
