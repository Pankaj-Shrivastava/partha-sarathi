import { queryVerses } from "../lib/chromaClient.js";
import { generateResponse } from "../lib/llmClient.js";
import { getSystemPrompt, getFormatInstruction } from "../lib/systemPrompt.js";
import { detectCrisis, detectOffTopic, detectFollowUp, validateFormat, validateCitation } from "../lib/guardrails.js";
import Sanscript from '@indic-transliteration/sanscript';

const sanitizeIast = (text) => {
  if (!text) return "";
  return text
    .replace(/śh/g, 'ṣ')
    .replace(/sh/g, 'ṣ')
    .replace(/ch/g, 'c') 
    .replace(/chh/g, 'ch');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId, isFollowUp } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Guardrail: Crisis Detection
    const crisisCheck = detectCrisis(message);
    if (crisisCheck.isCrisis) {
      return res.status(200).json({ type: "crisis", message: crisisCheck.message });
    }

    // Guardrail: Follow-Up Detection
    const followUpCheck = detectFollowUp(message, isFollowUp);
    if (followUpCheck.isFollowUp && followUpCheck.intent === 'negative') {
      return res.status(200).json({ type: "decline", message: followUpCheck.message });
    }
    // If followUp is positive, we proceed normally to fetch a new verse for their follow-up context

    // 1. Vector Retrieval
    const verses = await queryVerses(message, 3);
    
    // Guardrail: Off-Topic Detection (based on vector similarity)
    if (!isFollowUp) {
      const offTopicCheck = detectOffTopic(message, verses);
      if (offTopicCheck.isOffTopic) {
        return res.status(200).json({ type: "decline", message: offTopicCheck.message });
      }
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

    // 4. Call LLM with retry logic for format validation
    let llmResult = null;
    let attempts = 0;
    const maxAttempts = 2; // 1 initial + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const model = attempts === 1 ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile";
        llmResult = await generateResponse(fullSystemPrompt, contextString, message, model);
        
        // Guardrail: Post-LLM Format Validation
        const formatCheck = validateFormat(llmResult);
        if (formatCheck.isValid) {
          break; // Success
        } else {
          console.warn(`Format invalid on attempt ${attempts}: ${formatCheck.reason}`);
          if (attempts === maxAttempts) {
            throw new Error(`LLM failed to produce valid format after ${maxAttempts} attempts: ${formatCheck.reason}`);
          }
        }
      } catch (err) {
        if (attempts === maxAttempts) throw err;
      }
    }

    // Guardrail: Post-LLM Citation Validation
    const chromaMetadata = verses.map(v => v.metadata);
    const citationCheck = validateCitation(llmResult, chromaMetadata);

    let bestMatchVerse = verses[0]; // default to highest rank

    if (citationCheck.isValid) {
      // Find the specific verse the LLM successfully cited
      for (const v of verses) {
        if (parseInt(v.metadata.chapter, 10) === parseInt(llmResult.shloka.chapter, 10) && 
            parseInt(v.metadata.verse, 10) === parseInt(llmResult.shloka.verse, 10)) {
          bestMatchVerse = v;
          break;
        }
      }
    } else {
      console.warn("LLM hallucinated citation or stripped it. Defaulting to best semantic match.");
      // If fabricated, we just use the best vector match and ignore LLM's citation
    }

    // 6. Construct final API Response (Schema defined in architecture.md)
    const finalResponse = {
      type: "shloka_response",
      shloka: {
        chapter: bestMatchVerse.metadata.chapter,
        verse: bestMatchVerse.metadata.verse,
        citation: bestMatchVerse.metadata.citation,
        text_content: bestMatchVerse.document,
        devanagari: Sanscript.t(sanitizeIast(bestMatchVerse.metadata.sanskrit_roman), 'iast', 'devanagari') || null,
        roman: bestMatchVerse.metadata.sanskrit_roman || llmResult.shloka?.roman || null
      },
      translation: bestMatchVerse.metadata.translation || llmResult.translation,
      application: llmResult.application,
      reflection: llmResult.reflection,
      sources: verses.map(v => ({
        chapter: v.metadata.chapter,
        verse: v.metadata.verse,
        similarity: 1 - v.distance // Chroma returns distance, we return similarity (0 to 1)
      }))
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
