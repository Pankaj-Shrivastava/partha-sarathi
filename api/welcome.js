export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chromaUrl = process.env.CHROMA_URL;
    const chromaToken = process.env.CHROMA_TOKEN;

    const headers = { "Content-Type": "application/json" };
    if (chromaToken) {
      headers["Authorization"] = `Bearer ${chromaToken}`;
    }

    // 1. Get collection UUID
    const colRes = await fetch(`${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database/collections/gita_verses`, { headers });
    if (!colRes.ok) throw new Error("Failed to get collection");
    const col = await colRes.json();
    const uuid = col.id;

    // 2. Get document count
    const countRes = await fetch(`${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database/collections/${uuid}/count?read_level=index_and_wal`, { headers });
    if (!countRes.ok) throw new Error("Failed to get count");
    const count = await countRes.json();

    // 3. Fetch a random document
    const randomOffset = Math.floor(Math.random() * count);
    const getRes = await fetch(`${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database/collections/${uuid}/get`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        limit: 1,
        offset: randomOffset,
        include: ["metadatas", "documents"]
      })
    });
    if (!getRes.ok) throw new Error("Failed to fetch random verse");
    const result = await getRes.json();

    if (!result || !result.metadatas || result.metadatas[0].length === 0) {
      return res.status(500).json({ error: "No verses found" });
    }

    const meta = result.metadatas[0][0] || result.metadatas[0]; // Depending on Chroma get format
    // In raw fetch, result.metadatas is usually [[{...}]] if multiple ids were requested, or if unbatched, might be [{...}]
    // Actually for GET it returns `metadatas: [{...}]`
    const actualMeta = Array.isArray(result.metadatas[0]) ? result.metadatas[0][0] : result.metadatas[0];

    return res.status(200).json({
      type: "welcome",
      shloka: {
        devanagari: actualMeta.devanagari || null,
        roman: actualMeta.sanskrit_roman || null,
        citation: actualMeta.citation || `BG ${actualMeta.chapter}.${actualMeta.verse}`
      },
      translation: actualMeta.translation || "Translation unavailable for this specific verse."
    });

  } catch (error) {
    console.error("Welcome endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
