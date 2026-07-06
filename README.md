# Partha-Sarathi: AI Bhagavad Gita Guide

Partha-Sarathi is an AI-powered philosophical guide that provides context-aware, translated, and compassionate guidance based on the teachings of the *Bhagavad Gita As It Is*. By leveraging Retrieval-Augmented Generation (RAG) and specialized safety guardrails, it ensures that users receive profound spiritual insights while maintaining strict boundaries around mental health and off-topic queries.

## Architecture Overview

```mermaid
flowchart TD
    User([User Input]) --> Frontend[React/Vite Frontend]
    Frontend --> API[Vercel Serverless API]
    
    API --> Guardrails{Guardrail Engine}
    
    Guardrails -- "Crisis Detected" --> Crisis[Return Compassionate Fallback]
    Guardrails -- "Off-Topic" --> OffTopic[Return Polite Decline]
    
    Guardrails -- "Valid Query" --> ChromaDB[(ChromaDB Vector DB)]
    
    ChromaDB -- "Retrieve Verses" --> LLM[Groq LLM (Llama-3)]
    
    LLM -- "Validate Output Format" --> PostGuard[Output Validation]
    
    PostGuard --> Response[Final JSON Response]
    Response --> Frontend
```

## Setup Instructions

### Local Development

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the Vector Database:**
   - Install Python dependencies from `requirements.txt`.
   - Ensure the source PDF (`Bhagavad-gita-As-It-Is.pdf`) is in the `/pdf` directory.
   - Run the ingestion pipeline sequentially:
     `python ingestion/extract.py`
     `python ingestion/chunk.py`
     `python ingestion/embed.py`
     `python ingestion/ingest.py`
   - Start the local ChromaDB server: `chroma run --path ./chroma_db`

3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory.
   - Refer to the **Environment Variables Reference** below.

4. **Run the Development Servers:**
   - Start the Vite frontend: `npm run dev`
   - Start the local API server: `npm run api` (or `node --watch local-server.js`)

### Production Deployment (Vercel & HuggingFace Spaces)

1. **Database:** Deploy the ChromaDB instance to a cloud provider (e.g., HuggingFace Spaces) using the Rust binary.
2. **Frontend & API:** Import the repository into Vercel.
3. **Environment:** Set the Vercel project environment variables.
4. **Deploy:** Vercel will automatically build the static frontend and map the `/api/*` routes to serverless functions.

## Environment Variables Reference

| Variable | Description | Required For |
|---|---|---|
| `GROQ_API_KEY` | Your API key for Groq to access the Llama-3 models. | Local & Production |
| `CHROMA_URL` | The URL of your ChromaDB instance. (e.g., `http://localhost:8000` or hosted URL). | Local & Production |
| `CHROMA_TOKEN` | Authentication token for your hosted ChromaDB. | Production (Optional locally) |

## Known Limitations

- **Rate Limits:** The application relies on the free tier of the Groq API. High concurrent usage may result in rate-limit errors (429).
- **Session Persistence:** Currently, chat sessions are stored transiently using browser `sessionStorage`. Refreshing or closing the tab resets the conversation context.
- **Language Scope:** Real-time UI translation is currently limited to English and Hindi.

## License

MIT License — © 2026 Pankaj
