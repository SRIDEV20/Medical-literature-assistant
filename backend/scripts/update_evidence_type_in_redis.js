const fs = require("fs");
const path = require("path");
const { createClient } = require("redis");

const DATA_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks_tagged.json"
);

const redis = createClient({
  url: "redis://localhost:6379",
});

async function run() {
  await redis.connect();

  const chunks = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

  for (const chunk of chunks) {
    const key = `doc:${chunk.chunkId}`;

    await redis.hSet(key, {
      evidence_type: chunk.evidence_type,
    });

    console.log(`✅ Updated evidence_type for ${key}`);
  }

  await redis.quit();
  console.log("🎉 Evidence types stored in Redis");
}

run().catch(console.error);
