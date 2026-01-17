const fs = require("fs");
const path = require("path");
const { createClient } = require("redis");

const DATA_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks_with_embeddings.json"
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
      chunk_id: chunk.chunkId,
      paper_id: chunk.paperId,
      text: chunk.text,
      journal: chunk.journal,
      year: chunk.year,
      embedding: Buffer.from(
        new Float32Array(chunk.embedding).buffer
      ),
    });

    console.log(`✅ Stored ${key}`);
  }

  await redis.quit();
  console.log("🎉 All chunks stored in Redis");
}

run().catch(console.error);
