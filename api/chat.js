import { queryVerses } from "../lib/chromaClient.js";
import { generateResponse } from "../lib/llmClient.js";
import { getSystemPrompt, getFormatInstruction } from "../lib/systemPrompt.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId, isFollowUp } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Vector Retrieval
    // Get top 3 relevant verses
    const verses = await queryVerses(message, 3);
    
    if (verses.length === 0) {
      return res.status(500).json({ error: "Failed to retrieve context from knowledge base" });
    }

    // 2. Assemble Context
    let contextString = "";
    for (let i = 0; i < verses.length; i++) {
      const v = verses[i];
      contextString += `[Citation: ${v.metadata.citation}]\n`;
      contextString += `[Sanskrit: ${v.metadata.sanskrit_roman || "N/A"}]\n`;
      contextString += `[Translation: ${v.metadata.translation || "N/A"}]\n`;
      contextString += `[Context/Purport excerpt: ${v.document}]\n\n`;
    }

    // 3. Assemble full system prompt
    const fullSystemPrompt = `${getSystemPrompt()}\n\n${getFormatInstruction()}`;

    // 4. Call LLM
    const llmResult = await generateResponse(fullSystemPrompt, contextString, message);

    // 5. Enhance LLM result with missing devanagari if the LLM hallucinated or stripped it
    // Often LLMs struggle to output pure devanagari reliably, so we map it back from our retrieved metadata
    // based on the citation the LLM chose.
    
    // Find the original verse from our retrieved chunks to ensure metadata accuracy
    // (In case the LLM modified the citation string, we do our best to match)
    let bestMatchVerse = verses[0]; // default to the highest ranked vector match
    
    for (const v of verses) {
      if (llmResult.application && llmResult.application.includes(v.metadata.chapter.toString()) && 
          llmResult.application.includes(v.metadata.verse.toString())) {
        bestMatchVerse = v;
        break;
      }
    }

    // 6. Construct final API Response (Schema defined in architecture.md)
    const finalResponse = {
      type: "chat",
      shloka: {
        devanagari: bestMatchVerse.metadata.devanagari || llmResult.shloka?.devanagari || null,
        roman: bestMatchVerse.metadata.sanskrit_roman || llmResult.shloka?.roman || null,
        citation: bestMatchVerse.metadata.citation
      },
      translation: bestMatchVerse.metadata.translation || llmResult.translation,
      application: llmResult.application,
      reflection: llmResult.reflection
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
