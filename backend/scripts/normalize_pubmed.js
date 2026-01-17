const fs = require("fs");
const path = require("path");

const RAW_FILE = path.join(__dirname, "../../data/raw/pubmed_cardiology_page1.txt");
const OUTPUT_FILE = path.join(__dirname, "../../data/processed/pubmed_cardiology.json");

const rawText = fs.readFileSync(RAW_FILE, "utf-8");

// Split records by blank lines
const records = rawText.split("\n\n");

const papers = [];

let current = {};

for (const block of records) {
  const lines = block.split("\n");

  for (const line of lines) {
    if (line.startsWith("PMID-")) {
      current.paperId = line.replace("PMID-", "").trim();
    }

    if (line.startsWith("TI  -")) {
      current.title = line.replace("TI  -", "").trim();
    }

    if (line.startsWith("AB  -")) {
      current.abstract = line.replace("AB  -", "").trim();
    }

    if (line.startsWith("JT  -")) {
      current.journal = line.replace("JT  -", "").trim();
    }

    if (line.startsWith("DP  -")) {
      const yearMatch = line.match(/\d{4}/);
      if (yearMatch) current.year = Number(yearMatch[0]);
    }
  }

  // Push only valid papers
  if (current.paperId && current.abstract) {
    papers.push(current);
  }

  current = {};
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(papers, null, 2));

console.log(`✅ Normalized ${papers.length} papers`);
