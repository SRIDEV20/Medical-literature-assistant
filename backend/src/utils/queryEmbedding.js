// backend/src/utils/queryEmbedding.js

const OpenAI = require("openai");

const EMBEDDING_DIM = 1536;

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a semantic embedding for a query using OpenAI.
 * This is used for Redis vector search (KNN).
 */
async function generateQueryEmbedding(question) {
  if (!question || typeof question !== "string") {
    throw new Error("Invalid question for embedding");
  }

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  return response.data[0].embedding;
}

module.exports = {
  generateQueryEmbedding,
  EMBEDDING_DIM,
};
