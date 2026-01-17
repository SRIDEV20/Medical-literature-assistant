// backend/src/utils/mapCitations.js

function mapCitations(evidenceArray) {
  return evidenceArray.map((paper) => ({
    ...paper,
    citation: `${paper.journal}, ${paper.year}`,
  }));
}

module.exports = {
  mapCitations,
};
