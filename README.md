#  Medical Literature Assistant

An AI-powered medical literature assistant that retrieves peer-reviewed clinical evidence, evaluates its strength, and generates **safe, citation-backed summaries** for medical research questions.

This system is designed to assist researchers, clinicians, and students in understanding existing medical literature.  
It **does not provide medical advice, diagnosis, or treatment**.

---

##  Medical Disclaimer

This application is for **informational and research purposes only**.  
It does **not** constitute medical advice.  
Always consult a qualified healthcare professional before making medical decisions.

---

##  Problem Statement

Medical research literature is:
- Large and fragmented across journals
- Time-consuming to interpret
- Easy for AI systems to misrepresent or hallucinate

Most AI tools summarize medical topics **without grounding responses in real evidence**.

This project addresses that gap by:
- Retrieving **only indexed medical literature**
- Explicitly showing **citations and evidence strength**
- Generating **cautious, evidence-bound summaries**
- Flagging uncertainty and weak evidence

---

##  System Overview

The assistant follows a **Retrieval-Augmented Generation (RAG)** pipeline:

1. User submits a medical research question
2. The question is converted into a vector embedding
3. Relevant medical literature chunks are retrieved using vector search
4. Evidence is grouped by paper and cited
5. Evidence strength and warnings are assigned
6. An LLM generates a summary **only from retrieved evidence**
7. User feedback is stored for analysis

---

##  High-Level Architecture
```
Frontend (React)
↓
Backend API (Node.js + Express)
↓
Vector Search (Redis HNSW)
↓
Evidence Grouping & Scoring
↓
LLM Reasoning (OpenAI)
↓
MongoDB (Queries & Feedback)

```

---

##  Tech Stack

### Frontend
- React
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (Vector Search with HNSW)
- JWT Authentication (for feedback)

### AI / Data
- OpenAI Embeddings
- OpenAI LLM (reasoning over retrieved evidence)
- Retrieval-Augmented Generation (RAG)

---

##  Key Features

-  Semantic search over medical literature
-  Citation-backed responses
-  Evidence strength classification
-  Safety warnings for weak or insufficient evidence
-  Transparent source inspection
-  User feedback collection
-  Query history tracking
-  Auth-protected feedback API

---

##  Example Query

**Question:**  
> What do clinical trials say about HFpEF?

**Response includes:**
- Evidence-based summary
- Confidence level (high / low / none)
- Explicit warnings when evidence is weak
- Journal citation and year
- Evidence type and strength
- Source text inspection

---

##  Project Structure
```
medical-literature-assistant/
│
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── models/
│ │ ├── utils/
│ │ ├── prompts/
│ │ ├── config/
│ │ ├── app.js
│ │ └── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md
```

---

##  Running the Project Locally

### Prerequisites
- Node.js ≥ 18
- MongoDB (local installation or MongoDB Atlas)
- Redis (Docker recommended)
- OpenAI API key

---

### Start Redis (Docker)
```bash
docker run -d -p 6379:6379 redis

Frontend Setup
cd frontend
npm install
npm start

Responsible AI Design
This system is intentionally designed to:

Avoid hallucinated medical claims

Restrict LLM output to retrieved evidence only

Explicitly signal uncertainty

Warn users about weak or limited evidence

Include medical disclaimers by default

 Future Enhancements

Support for additional medical journals

More granular evidence grading (e.g., GRADE framework)

User accounts and saved queries

Feedback analytics dashboard

PDF upload and ingestion pipeline





