const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    confidence: { type: String },
    evidence: [
      {
        paperId: String,
        journal: String,
        year: Number,
        evidenceStrength: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", QuerySchema);
