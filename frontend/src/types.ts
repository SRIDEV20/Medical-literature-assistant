export type EvidenceItem = {
  paperId: string;
  journal: string;
  year: number;
  citation: string;
  evidence_type: "RCT" | "Review" | "Observational";
  evidenceStrength: "High" | "Medium" | "Low";
  chunks: string[];
};

export type QueryResponse = {
  question: string;
  confidence: "none" | "low" | "high";
  note: string | null;
  warnings: string[];
  answer: string | null;
  answerMode: "stub" | "llm" | null;
  evidence: EvidenceItem[];
  status: "OK";
};
