import { pipeline, env } from "@xenova/transformers";

// Don't download models to local disk in serverless environment if not needed, 
// but for standard Node.js this is fine. Vercel allows /tmp storage.
env.allowLocalModels = false;

// Module-level singleton for the pipeline to avoid re-initializing on every request during cold starts
let embedderPipeline = null;

async function getEmbedder() {
  if (!embedderPipeline) {
    // all-MiniLM-L6-v2 creates 384-dimensional embeddings (matching our python ingestion)
    embedderPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPipeline;
}

// Cache the collection UUID to save a network request
let collectionUuid = null;

async function getCollectionUuid() {
  if (collectionUuid) return collectionUuid;

  const chromaUrl = process.env.CHROMA_URL;
  const chromaToken = process.env.CHROMA_TOKEN;

  const headers = { "Content-Type": "application/json" };
  if (chromaToken) headers["Authorization"] = `Bearer ${chromaToken}`;

  const res = await fetch(`${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database/collections/gita_verses`, {
    headers
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch collection: ${res.statusText}`);
  }
  
  const col = await res.json();
  collectionUuid = col.id;
  return collectionUuid;
}

export async function queryVerses(queryText, topK = 3) {
  try {
    const uuid = await getCollectionUuid();

    // Generate embedding
    const embedder = await getEmbedder();
    const output = await embedder(queryText, { pooling: "mean", normalize: true });
    
    // Convert Float32Array to standard JS Array
    const queryEmbedding = Array.from(output.data);

    // Query ChromaDB via raw fetch (bypassing JS client bugs)
    const chromaUrl = process.env.CHROMA_URL;
    const chromaToken = process.env.CHROMA_TOKEN;
    const headers = { "Content-Type": "application/json" };
    if (chromaToken) headers["Authorization"] = `Bearer ${chromaToken}`;

    const res = await fetch(`${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database/collections/${uuid}/query`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query_embeddings: [queryEmbedding],
        n_results: topK,
        include: ["documents", "metadatas", "distances"]
      })
    });

    if (!res.ok) {
      throw new Error(`Chroma query failed: ${res.statusText}`);
    }

    const results = await res.json();

    if (!results || !results.ids || results.ids[0].length === 0) {
      return [];
    }

    // Format the response
    const formattedResults = [];
    for (let i = 0; i < results.ids[0].length; i++) {
      formattedResults.push({
        id: results.ids[0][i],
        distance: results.distances[0][i],
        document: results.documents[0][i],
        metadata: results.metadatas[0][i],
      });
    }

    return formattedResults;
  } catch (error) {
    console.error("Error querying ChromaDB:", error);
    throw error;
  }
}
