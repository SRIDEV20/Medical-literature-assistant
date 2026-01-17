const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(
  __dirname,
  "../../data/processed/pubmed_cardiology.json"
);

const OUTPUT_FILE = path.join(
  __dirname,
  "../../data/chunks/pubmed_cardiology_chunks.json"
);

// simple word-based chunking (safe & predictable)
const CHUNK_SIZE = 120; // words (~500–800 tokens comes later with tokenizer)

const papers = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

const chunks = [];

papers.forEach((paper) => {
  const words = paper.abstract.split(/\s+/);

  let chunkIndex = 0;

  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    const chunkWords = words.slice(i, i + CHUNK_SIZE);
    const text = chunkWords.join(" ");

    chunks.push({
      chunkId: `${paper.paperId}_chunk_${chunkIndex}`,
      paperId: paper.paperId,
      text,
      journal: paper.journal,
      year: paper.year,
    });

    chunkIndex++;
  }
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(chunks, null, 2));

console.log(`✅ Created ${chunks.length} chunks`);
