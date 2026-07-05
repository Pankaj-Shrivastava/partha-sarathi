export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chromaUrl = process.env.CHROMA_URL;
    const chromaToken = process.env.CHROMA_TOKEN;

    if (!chromaUrl) {
      return res.status(500).json({ status: "error", message: "CHROMA_URL is missing" });
    }

    const headers = {};
    if (chromaToken) {
      headers["Authorization"] = `Bearer ${chromaToken}`;
    }

    const hbRes = await fetch(`${chromaUrl}/api/v2/heartbeat`, { headers });
    
    if (!hbRes.ok) {
      throw new Error(`Heartbeat failed with status: ${hbRes.status}`);
    }

    const heartbeat = await hbRes.json();
    
    return res.status(200).json({ 
      status: "ok", 
      chromadb: "connected",
      heartbeat: heartbeat 
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
