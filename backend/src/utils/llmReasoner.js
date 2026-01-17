// backend/src/utils/llmReasoner.js

const OpenAI = require("openai");

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * LLM Reasoner
 * - Uses OpenAI GPT for evidence-grounded reasoning
 * - Falls back safely if API key is missing
 */
async function reasonOverEvidence({
  systemPrompt,
  question,
  evidenceText,
}) {
  const llmEnabled = !!process.env.OPENAI_API_KEY;

  // 🔒 Safety fallback (should rarely trigger now)
  if (!llmEnabled) {
    return {
      mode: "stub",
      answer:
        "An evidence-based summary will be generated once the reasoning engine is enabled. " +
        "At present, the system is operating in retrieval-only mode.",
    };
  }

  // 🔌 REAL OpenAI reasoning
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Question:\n${question}\n\nEvidence:\n${evidenceText}`,
      },
    ],
    temperature: 0.2, // low temperature for medical grounding
  });

  return {
    mode: "openai",
    answer: completion.choices[0].message.content,
  };
}

module.exports = {
  reasonOverEvidence,
};
