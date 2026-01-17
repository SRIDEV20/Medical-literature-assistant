const express = require("express");

const {
  generateQueryEmbedding,
  EMBEDDING_DIM,
} = require("../utils/queryEmbedding");
const { searchSimilarChunks } = require("../utils/redisSearch");
const { groupChunksByPaper } = require("../utils/groupByPaper");
const { formatGroupedEvidence } = require("../utils/formatEvidence");
const { mapCitations } = require("../utils/mapCitations");
const { assignEvidenceStrength } = require("../utils/evidenceStrength");
const { generateEvidenceWarnings } = require("../utils/evidenceWarnings");
const { startTimer, endTimerMs } = require("../utils/timer");

const { MEDICAL_SYSTEM_PROMPT } = require("../prompts/medicalPrompt");
const { reasonOverEvidence } = require("../utils/llmReasoner");

// 🧠 Day 37: Query persistence
const Query = require("../models/query.model");

const router = express.Router();

/**
 * Semantic relevance guard.
 * Ensures evidence topic overlaps with the question.
 */
function isLikelyRelevant(question, evidenceArray) {
  if (!evidenceArray || evidenceArray.length === 0) return false;

  const questionTokens = question
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);

  for (const paper of evidenceArray) {
    const evidenceText = paper.chunks.join(" ").toLowerCase();

    for (const token of questionTokens) {
      if (evidenceText.includes(token)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Convert evidence into readable text for LLM
 */
function evidenceToText(evidenceArray) {
  return evidenceArray
    .map(
      (paper) =>
        `Journal: ${paper.journal} (${paper.year})
Evidence type: ${paper.evidence_type}
Evidence strength: ${paper.evidenceStrength}
Findings:
${paper.chunks.join("\n")}`
    )
    .join("\n\n---\n\n");
}

/**
 * POST /api/query
 * Body: { question: string }
 */
router.post("/", async (req, res) => {
  const totalStart = startTimer();

  try {
    const { question } = req.body;

    // 0️⃣ Validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question must be a non-empty string",
      });
    }

    // 1️⃣ Query → embedding
    const embedStart = startTimer();
    const queryEmbedding = await generateQueryEmbedding(question);
    const embeddingMs = endTimerMs(embedStart);

    // 2️⃣ Redis vector search
    const redisStart = startTimer();
    const rawChunks = await searchSimilarChunks(queryEmbedding, 5);
    const redisMs = endTimerMs(redisStart);

    // 3️⃣ Group → citation → strength
    const groupStart = startTimer();
    const groupedEvidence = groupChunksByPaper(rawChunks);

    let formattedEvidence = assignEvidenceStrength(
      mapCitations(formatGroupedEvidence(groupedEvidence))
    );

    // 4️⃣ Evidence warnings
    const evidenceWarnings = generateEvidenceWarnings(formattedEvidence);

    const groupingMs = endTimerMs(groupStart);
    const totalMs = endTimerMs(totalStart);

    // 5️⃣ Confidence & safety logic
    let confidence = "high";
    let note = null;

    if (!isLikelyRelevant(question, formattedEvidence)) {
      confidence = "none";
      note = "No relevant medical evidence found for this query.";
      formattedEvidence = [];
    } else if (rawChunks.length < 2) {
      confidence = "low";
      note =
        "Limited evidence found. Results may not be comprehensive.";
    }

    // 6️⃣ LLM reasoning (STUB MODE)
    let answer = null;
    let answerMode = null;

    if (confidence !== "none" && formattedEvidence.length > 0) {
      const evidenceText = evidenceToText(formattedEvidence);

      const result = await reasonOverEvidence({
        systemPrompt: MEDICAL_SYSTEM_PROMPT,
        question,
        evidenceText,
      });

      answer = result.answer;
      answerMode = result.mode; // "stub"
    }

    // 7️⃣ Day 37 — Persist query
    const savedQuery = await Query.create({
      question,
      confidence,
      evidence: formattedEvidence.map((e) => ({
        paperId: e.paperId,
        journal: e.journal,
        year: e.year,
        evidenceStrength: e.evidenceStrength,
      })),
    });

    // Observability
    console.log(
      `[QUERY] id=${savedQuery._id} | total=${totalMs.toFixed(
        2
      )}ms | confidence=${confidence}`
    );

    return res.status(200).json({
      queryId: savedQuery._id, // ✅ critical for feedback linking
      question,
      confidence,
      note,
      warnings: evidenceWarnings,
      answer,
      answerMode,
      evidence: formattedEvidence,
      debug: {
        rawChunkCount: rawChunks.length,
        paperCount: formattedEvidence.length,
        embedding: {
          type: "placeholder",
          dimension: EMBEDDING_DIM,
          latency_ms: embeddingMs,
        },
        redis: {
          latency_ms: redisMs,
        },
        grouping: {
          latency_ms: groupingMs,
        },
        total_latency_ms: totalMs,
      },
      status: "OK",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;
