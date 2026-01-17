// backend/src/utils/evidenceStrength.js

function assignEvidenceStrength(evidenceArray) {
  return evidenceArray.map((paper) => {
    let evidenceStrength = "Low";

    switch (paper.evidence_type) {
      case "RCT":
        evidenceStrength = "High";
        break;
      case "Review":
        evidenceStrength = "Medium";
        break;
      case "Observational":
        evidenceStrength = "Low";
        break;
      default:
        evidenceStrength = "Low";
    }

    return {
      ...paper,
      evidenceStrength,
    };
  });
}

module.exports = {
  assignEvidenceStrength,
};
