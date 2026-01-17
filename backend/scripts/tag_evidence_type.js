const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks_with_embeddings.json"
);

const OUTPUT_FILE = path.resolve(
  "data/chunks/pubmed_cardiology_chunks_tagged.json"
);

function detectEvidenceType(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("randomized") ||
    lower.includes("randomised") ||
    lower.includes("trial") ||
    lower.includes("rct")
  ) {
    return "RCT";
  }

  if (
    lower.includes("review") ||
    lower.includes("meta-analysis") ||
    lower.includes("systematic review")
  ) {
    return "Review";
  }

  return "Observational";
}

const chunks = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

const tagged = chunks.map((chunk) => ({
  ...chunk,
  evidence_type: detectEvidenceType(
    `${chunk.text}`
  ),
}));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tagged, null, 2));

console.log(`✅ Tagged ${tagged.length} chunks with evidence type`);
