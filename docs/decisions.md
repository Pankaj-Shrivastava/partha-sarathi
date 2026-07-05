# Partha-Sarathi — Decision Log

> A living record of every significant technical, design, and process decision made during the project.
> Each entry captures the **context**, **options considered**, **decision**, and **rationale** so that future contributors (or future-you) understand *why* the project looks the way it does.
>
> References: [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/partha-sarathi/docs/architecture.md) · [implementation_plan.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/partha-sarathi/docs/implementation_plan.md) · [edgeCases.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/partha-sarathi/docs/edgeCases.md)

---

## How to Use This Document

1. **When a non-trivial decision is made**, add a new entry at the top of the log (newest first).
2. **Use the template** at the bottom of this file.
3. **Never delete entries.** If a decision is reversed, add a new entry that supersedes it and link back.
4. Each decision has a status:

| Status | Meaning |
|---|---|
| ✅ **Accepted** | Decision is final and implemented |
| 🔄 **Superseded** | Replaced by a newer decision (link provided) |
| 🟡 **Proposed** | Under discussion — not yet committed |
| ❌ **Rejected** | Considered but not adopted |

---

## Decision Log

---

### DEC-010 — Use Tailwind CSS v4 over Vanilla CSS for frontend styling

| Field | Value |
|---|---|
| **ID** | DEC-010 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 8 — Frontend |
| **Deciders** | Pankaj |

**Context:**
The frontend needs a styling approach that enables rapid UI development, responsive design, and dark mode support. Two main options were considered.

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **Vanilla CSS** (custom properties) | Full control, no build dependency, zero learning curve | Verbose, manual responsive/dark mode, slower iteration |
| **Tailwind CSS v4** | Utility-first, JIT compiler, built-in dark mode, rapid prototyping | Additional build dependency, larger initial config |

**Decision:** Use **Tailwind CSS v4** with the Vite plugin.

**Rationale:**
- Tailwind's utility classes dramatically speed up UI development — no context-switching between JSX and CSS files.
- Built-in `dark:` variants and responsive prefixes (`md:`, `lg:`) eliminate boilerplate.
- JIT compiler keeps the production bundle small (only used classes are shipped).
- Widely adopted in the React ecosystem; strong community support and documentation.

---

### DEC-009 — Use Groq over OpenAI or Google Gemini for LLM inference

| Field | Value |
|---|---|
| **ID** | DEC-009 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 6 — Backend API |
| **Deciders** | Pankaj |

**Context:**
The chatbot needs an LLM provider for generating grounded responses from retrieved verse context. The project targets a $0 total cost.

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **OpenAI (GPT-4o-mini)** | Best instruction-following, extensive docs | Requires credit card, pay-per-token |
| **Google Gemini** | Generous free tier, multimodal | Different API surface, less community tooling for RAG |
| **Groq (Llama 3.1)** | Free tier (no credit card), LPU = sub-second latency, OpenAI-compatible API | Smaller model (8B), free-tier rate limits |

**Decision:** Use **Groq** with `llama-3.1-8b-instant` as primary and `llama-3.3-70b-versatile` as fallback.

**Rationale:**
- $0 cost with no credit card required — aligns with the project's zero-budget constraint.
- OpenAI-compatible API means the codebase can swap providers with a single env var change (no code modification).
- LPU inference delivers sub-second latency — eliminates the need for streaming (SSE) complexity.
- Open-source Llama models mean no vendor lock-in on the model itself.
- The 8B model handles structured formatting well at temperature 0.3; the 70B fallback covers edge cases.

---

### DEC-008 — Use `all-MiniLM-L6-v2` over larger embedding models

| Field | Value |
|---|---|
| **ID** | DEC-008 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 4 — Embedding Generation |
| **Deciders** | Pankaj |

**Context:**
Verse chunks need to be embedded into vectors for semantic similarity search. Multiple embedding models are available.

**Options Considered:**

| Option | Dimensions | Model Size | API Cost | English Quality |
|---|---|---|---|---|
| **all-MiniLM-L6-v2** | 384 | ~80 MB | Free (local) | Good |
| `all-mpnet-base-v2` | 768 | ~420 MB | Free (local) | Better |
| OpenAI `text-embedding-3-small` | 1536 | N/A | $0.02/1M tokens | Excellent |
| Cohere Embed v3 | 1024 | N/A | Free tier limited | Excellent |

**Decision:** Use **`all-MiniLM-L6-v2`** via `sentence-transformers`.

**Rationale:**
- 384 dimensions — half the storage of mpnet, 4× smaller than OpenAI embeddings. For ~700 verse chunks, quality difference is negligible.
- Runs on CPU in seconds — no GPU dependency, no API keys, no rate limits.
- 100% offline — no network calls during ingestion.
- The corpus is small (~700 verses); the marginal quality gain from larger models doesn't justify the cost or complexity.

---

### DEC-007 — Use ChromaDB over Pinecone, Weaviate, and FAISS

| Field | Value |
|---|---|
| **ID** | DEC-007 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 5 — Vector Database |
| **Deciders** | Pankaj |

**Context:**
The system needs a vector database to store ~700 verse embeddings and support cosine similarity queries at runtime from serverless functions.

**Options Considered:**

| Option | Hosting | Cost | Persistence | Complexity |
|---|---|---|---|---|
| **ChromaDB** | HuggingFace Spaces (Docker) | Free | Yes (Docker volume) | Low |
| Pinecone | Managed cloud | Free tier available | Yes | Low, but vendor lock-in |
| Weaviate | Self-hosted or cloud | Free self-host | Yes | High (overkill for 700 docs) |
| FAISS | In-memory (file-backed) | Free | No (reloads on cold start) | Medium |

**Decision:** Use **ChromaDB** self-hosted on HuggingFace Spaces.

**Rationale:**
- Free hosting on HF Spaces with Docker — $0 cost.
- Simple Python and JS client libraries — matches our dual-language stack.
- Native cosine similarity — no custom distance functions needed.
- ~700 records is well within ChromaDB's performance sweet spot.
- FAISS was rejected because serverless functions cold-start without persistent memory — FAISS would need to reload the index from file on every invocation.
- Pinecone was rejected to avoid vendor lock-in and external account dependencies.

---

### DEC-006 — Use Node.js serverless (Vercel) over Python backend (FastAPI)

| Field | Value |
|---|---|
| **ID** | DEC-006 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 6 — Backend API |
| **Deciders** | Pankaj |

**Context:**
The runtime API needs to handle HTTP requests, query ChromaDB, call the LLM, and return structured JSON. Both Python and Node.js are viable.

**Options Considered:**

| Factor | Node.js (Vercel) | Python (FastAPI) |
|---|---|---|
| Deployment | Native Vercel serverless — zero config | Separate hosting needed (Railway, Render) |
| Cost | Free Hobby Tier | Free tiers exist but less mature |
| Frontend co-location | Same Vercel project for React + API | Separate deployments, CORS headaches |
| Cold starts | ~500 ms | ~1–2 s (heavier runtime) |
| npm ecosystem | `openai` + `chromadb` packages available | Richer ML ecosystem (not needed at runtime) |

**Decision:** Use **Node.js** for the runtime API; keep **Python** only for offline ingestion.

**Rationale:**
- Co-locating frontend (React) and backend (API routes) in one Vercel project simplifies deployment, eliminates CORS configuration, and keeps the project monorepo-friendly.
- Node.js cold starts are faster (~500 ms vs. ~1–2 s for Python).
- All runtime dependencies (`openai`, `chromadb`) have mature npm packages.
- Python excels at ML/data processing — so it stays for the offline ingestion pipeline where it shines.

---

### DEC-005 — Non-streaming JSON responses over Server-Sent Events (SSE)

| Field | Value |
|---|---|
| **ID** | DEC-005 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 6 — Backend API |
| **Deciders** | Pankaj |

**Context:**
LLM responses can be streamed token-by-token (SSE) or returned as a complete JSON object. Streaming improves perceived latency for slow models.

**Decision:** Use **non-streaming JSON responses** for v1.

**Rationale:**
- Groq's LPU delivers full responses in < 1 second — streaming provides negligible UX benefit at these speeds.
- Streaming adds significant complexity: SSE on the backend, `ReadableStream` parsing on the frontend, partial JSON handling, and more complex error recovery.
- Non-streaming allows clean post-LLM validation (format check, hallucination check) before anything reaches the user.
- Can be upgraded to SSE in v2 if latency increases (e.g., switching to a larger model or a slower provider).

---

### DEC-004 — Verse-aware chunking over generic text splitting

| Field | Value |
|---|---|
| **ID** | DEC-004 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 3 — Chunking |
| **Deciders** | Pankaj |

**Context:**
The PDF content needs to be split into chunks for embedding. Generic text splitters (fixed character count) vs. domain-aware splitting that respects verse boundaries.

**Decision:** Use **verse-aware chunking** — each chunk maps to one verse unit (Devanagari + translation + partial purport) with structured metadata.

**Rationale:**
- The Bhagavad Gita has a clear, consistent structure (18 chapters, ~700 verses). Each verse is a natural semantic unit.
- Verse-aware chunking ensures that the retrieved context always contains a complete, citable verse — no partial shlokas or orphaned translations.
- Structured metadata (`chapter`, `verse`, `citation`, `devanagari`) enables direct display in the frontend without post-processing.
- Generic splitting (e.g., 500-char fixed windows) would frequently cut across verse boundaries, producing chunks that cite two partial verses and confuse the LLM.

---

### DEC-003 — Stateless backend with no user data persistence

| Field | Value |
|---|---|
| **ID** | DEC-003 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Cross-cutting — Architecture |
| **Deciders** | Pankaj |

**Context:**
The system could store chat history server-side for context continuity, analytics, or personalization. Privacy requirements (context.md §6) prohibit data collection.

**Decision:** The backend is **fully stateless** — no user data is stored anywhere. Chat history exists only in the frontend's React component state and is lost on page close.

**Rationale:**
- Context.md mandates: "Do not collect, store, or process any user information."
- Stateless serverless functions are simpler, cheaper, and more scalable — no database for user sessions.
- Ephemeral conversations protect user privacy by design, not by policy.
- Follow-up context (yes/no to reflection) is tracked client-side via `isFollowUp` flag — no server-side session needed.
- **Trade-off acknowledged:** Users lose their conversation on page refresh. This is acceptable given the privacy-first design.

---

### DEC-002 — Pre-LLM guardrails to short-circuit expensive operations

| Field | Value |
|---|---|
| **ID** | DEC-002 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 7 — Guardrails |
| **Deciders** | Pankaj |

**Context:**
The system needs to handle crisis inputs, off-topic queries, and follow-up responses. These checks could run before or after the expensive vector search + LLM call.

**Decision:** Run guardrails **before** the RAG pipeline (pre-LLM), with additional format/citation validation **after** the LLM response (post-LLM).

**Rationale:**
- Crisis detection must be instant — no delay from vector search or LLM generation. Users in distress need immediate response.
- Off-topic queries waste vector search and LLM tokens. Short-circuiting saves ~1 second of latency and Groq free-tier quota.
- Follow-up detection (yes/no) has a deterministic response — no LLM needed.
- Post-LLM checks (format validation, hallucination detection) are necessary because LLMs are non-deterministic and may deviate from the required A–B–C–D format.

---

### DEC-001 — Use PyMuPDF over pdfplumber, PDFMiner, and pdf2image+OCR

| Field | Value |
|---|---|
| **ID** | DEC-001 |
| **Date** | 2026-07-05 |
| **Status** | ✅ Accepted |
| **Phase** | Phase 2 — PDF Extraction |
| **Deciders** | Pankaj |

**Context:**
The 65 MB Bhagavad Gita PDF contains text layers, images (illustrations, decorative elements), and Devanagari script. We need to extract only the text.

**Options Considered:**

| Option | Speed | Devanagari | Image Handling | Complexity |
|---|---|---|---|---|
| **PyMuPDF (fitz)** | Fast | Good Unicode support | `get_text("text")` skips images | Low |
| pdfplumber | Medium | Good | Includes images by default | Medium |
| PDFMiner | Slow | Good | Text-only | High (verbose API) |
| pdf2image + Tesseract OCR | Very slow | Depends on OCR model | Requires image processing | Very high |

**Decision:** Use **PyMuPDF (`fitz`)** with `page.get_text("text")`.

**Rationale:**
- Fastest extraction speed for the 65 MB PDF — critical for developer iteration during chunking experiments.
- `get_text("text")` natively strips image data, reducing memory footprint.
- Good Unicode support — Devanagari characters survive extraction without special handling.
- Minimal API surface — single function call per page.
- OCR was rejected because the PDF already has a text layer — OCR adds unnecessary complexity and latency.

---

## Template for New Decisions

```markdown
### DEC-0XX — [Short title describing the decision]

| Field | Value |
|---|---|
| **ID** | DEC-0XX |
| **Date** | YYYY-MM-DD |
| **Status** | 🟡 Proposed / ✅ Accepted / ❌ Rejected / 🔄 Superseded by DEC-0YY |
| **Phase** | Phase X — [Phase name] |
| **Deciders** | [Who made the decision] |

**Context:**
[What situation or problem prompted this decision?]

**Options Considered:**

| Option | Pros | Cons |
|---|---|---|
| **Option A** | ... | ... |
| Option B | ... | ... |

**Decision:** [What was decided]

**Rationale:**
[Why this option was chosen over alternatives]

**Consequences:**
- [What trade-offs or follow-up actions result from this decision]
```

---

*Document version: 1.0 — July 2026*
*License: MIT — © 2026 Pankaj*
