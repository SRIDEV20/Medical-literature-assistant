// backend/src/utils/redisSearch.js

const { createClient } = require("redis");

const redis = createClient({
  url: "redis://localhost:6379",
});

async function searchSimilarChunks(queryEmbedding, k = 5) {
  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Query embedding must be an array");
  }

  if (!redis.isOpen) {
    await redis.connect();
  }

  // Convert embedding to Float32 buffer
  const vectorBuffer = Buffer.from(
    new Float32Array(queryEmbedding).buffer
  );

  const query = `*=>[KNN ${k} @embedding $vec AS score]`;

  const results = await redis.ft.search(
    "medlens_idx",
    query,
    {
      PARAMS: {
        vec: vectorBuffer,
      },
      SORTBY: "score",
      RETURN: [
        "chunk_id",
        "paper_id",
        "text",
        "journal",
        "year",
        "evidence_type",
        "score",
      ],
      DIALECT: 2,
    }
  );

  return results.documents || [];
}

module.exports = {
  searchSimilarChunks,
};
