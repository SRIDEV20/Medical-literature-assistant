// backend/src/utils/formatEvidence.js

function formatGroupedEvidence(groupedEvidence) {
  return Object.values(groupedEvidence).map((paper) => ({
    paperId: paper.paperId,
    journal: paper.journal,
    year: paper.year,
    evidence_type: paper.evidence_type,
    chunks: paper.chunks,
  }));
}

module.exports = {
  formatGroupedEvidence,
};
