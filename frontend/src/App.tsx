import { useState } from "react";
import "./App.css";
import type { QueryResponse } from "./types";

type HistoryItem = {
  question: string;
  response: QueryResponse;
};

function App() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openInspector, setOpenInspector] = useState<
    Record<number, boolean>
  >({});

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const json: QueryResponse = await res.json();
      setData(json);
      setHistory((prev) => [{ question, response: json }, ...prev]);
    } catch {
      setError(
        "Unable to reach MedLens backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (helpful: boolean) => {
    if (!data) return;

    try {
      await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: data.question,
          confidence: data.confidence,
          helpful,
        }),
      });
    } catch {
      // silent failure
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setQuestion(item.question);
    setData(item.response);
    setError(null);
  };

  const toggleInspector = (index: number) => {
    setOpenInspector((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="page-wrapper">
      <div className="app">
        <h1 className="title">Medical literature assistant</h1>
        <p className="subtitle">Ask questions. Get evidence-backed answers.</p>

        <div className="disclaimer">
          <strong>Medical Disclaimer:</strong> MedLens provides summaries of
          medical research literature for informational purposes only. It
          does not provide medical advice, diagnosis, or treatment. Always
          consult a qualified healthcare professional for medical
          decisions.
        </div>

        <div className="chat-box">
          <textarea
            className="question-input"
            placeholder="Ask a medical literature question..."
            value={question}
            disabled={loading}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="ask-button"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? "Analyzing evidence..." : "Ask"}
          </button>
        </div>

        {loading && (
          <div className="loading-box">
            Searching medical literature and evaluating evidence…
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {data && !loading && (
          <div className="response-box">
            <div className="safety-note">
              This response is generated from retrieved medical literature
              and may be incomplete or based on limited evidence.
            </div>

            <h3>Answer</h3>
            <p>{data.answer ?? "No answer available."}</p>

            <p>
              <strong>Confidence:</strong> {data.confidence}
            </p>

            <div className="feedback-buttons">
              <span>Was this helpful?</span>
              <button onClick={() => sendFeedback(true)}>👍</button>
              <button onClick={() => sendFeedback(false)}>👎</button>
            </div>

            {data.warnings.length > 0 && (
              <div className="warnings">
                <strong>Warnings:</strong>
                <ul>
                  {data.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.evidence.length > 0 && (
              <div className="evidence-section">
                <h4>Evidence</h4>

                {data.evidence.map((item, index) => (
                  <div key={index} className="evidence-card">
                    <p>
                      <strong>Citation:</strong> {item.citation}
                    </p>
                    <p>
                      <strong>Evidence type:</strong>{" "}
                      {item.evidence_type}
                    </p>
                    <p>
                      <strong>Evidence strength:</strong>{" "}
                      {item.evidenceStrength}
                    </p>

                    <button
                      className="inspector-toggle"
                      onClick={() => toggleInspector(index)}
                    >
                      {openInspector[index]
                        ? "Hide source text"
                        : "Show source text"}
                    </button>

                    {openInspector[index] && (
                      <div className="inspector-box">
                        {item.chunks.map((chunk, i) => (
                          <p key={i} className="chunk-text">
                            {chunk}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h4>Query History</h4>
            <ul className="history-list">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(item)}
                >
                  {item.question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
