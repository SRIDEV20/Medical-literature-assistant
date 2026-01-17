const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks.json"
);

const OUTPUT_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks_with_embeddings.json"
);

// TEMP embedding size (match future index)
const EMBEDDING_DIM = 1536;

function fakeEmbedding() {
  return Array(EMBEDDING_DIM).fill(0);
}

const chunks = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

const withEmbeddings = chunks.map((chunk) => ({
  ...chunk,
  embedding: fakeEmbedding(),
}));

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(withEmbeddings, null, 2)
);

console.log(`✅ Generated ${withEmbeddings.length} placeholder embeddings`);
