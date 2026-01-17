// backend/src/utils/groupByPaper.js

function groupChunksByPaper(chunks) {
  const grouped = {};

  for (const item of chunks) {
    const value = item.value || {};
    const paperId = value.paper_id;

    if (!paperId) continue;

    if (!grouped[paperId]) {
      grouped[paperId] = {
        paperId,
        journal: value.journal,
        year: value.year,
        evidence_type: value.evidence_type,
        chunks: [],
      };
    }

    // Avoid duplicate chunk text
    if (
      value.text &&
      !grouped[paperId].chunks.includes(value.text)
    ) {
      grouped[paperId].chunks.push(value.text);
    }
  }

  return grouped;
}

module.exports = {
  groupChunksByPaper,
};
