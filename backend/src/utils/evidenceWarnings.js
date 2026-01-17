// backend/src/utils/evidenceWarnings.js

function generateEvidenceWarnings(evidenceArray) {
  if (!evidenceArray || evidenceArray.length === 0) {
    return [];
  }

  const strengths = evidenceArray.map(
    (e) => e.evidenceStrength
  );

  const uniqueStrengths = new Set(strengths);
  const warnings = [];

  // Weak evidence
  if (uniqueStrengths.size === 1 && strengths[0] === "Low") {
    warnings.push(
      "Available evidence is weak and conclusions should be interpreted cautiously."
    );
  }

  // Contradictory or mixed evidence
  if (uniqueStrengths.size > 1) {
    warnings.push(
      "Evidence is mixed or contradictory across studies."
    );
  }

  return warnings;
}

module.exports = {
  generateEvidenceWarnings,
};
