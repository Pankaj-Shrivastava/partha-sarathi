// Pre-LLM and Post-LLM Guardrails for Partha-Sarathi API

// 1. Detect Crisis (Self-harm, suicide, severe trauma)
export function detectCrisis(message) {
  if (!message) return { isCrisis: false };
  
  const crisisKeywords = [
    "kill myself", "suicide", "end my life", "want to die", 
    "cut myself", "self-harm", "self harm", "jump off",
    "no reason to live", "worthless", "better off dead"
  ];
  
  const lowerMsg = message.toLowerCase();
  for (const kw of crisisKeywords) {
    if (lowerMsg.includes(kw)) {
      return { 
        isCrisis: true,
        message: "It sounds like you are going through a very difficult time. Please reach out to a professional helpline."
      };
    }
  }
  return { isCrisis: false };
}

// 2. Detect Off-topic (Based on ChromaDB max similarity)
export function detectOffTopic(message, chromaResults) {
  if (!chromaResults || chromaResults.length === 0) {
    return {
      isOffTopic: true,
      message: "I don't have a direct verse for this, but the general principle is that we must focus on our duties with a balanced mind. Could you share a life situation you'd like philosophical perspective on?"
    };
  }

  // Calculate highest similarity
  const maxSimilarity = Math.max(...chromaResults.map(v => 1 - v.distance));

  if (maxSimilarity < 0.25) {
    return {
      isOffTopic: true,
      message: "I can only provide guidance grounded in the Bhagavad Gita's teachings. Could you share a life situation or dilemma you'd like philosophical perspective on?"
    };
  }

  return { isOffTopic: false };
}

// 3. Detect Follow-Up Intent (Yes/No parsing)
export function detectFollowUp(message, isFollowUpReq) {
  if (!isFollowUpReq || !message) return { isFollowUp: false, intent: 'none' };

  const lowerMsg = message.toLowerCase().trim();
  
  // Basic boolean matching for follow ups
  const positive = ["yes", "yeah", "yep", "sure", "please", "do it", "ok", "okay"];
  const negative = ["no", "nope", "nah", "stop", "nevermind", "don't"];

  if (negative.some(n => lowerMsg === n || lowerMsg.startsWith(n))) {
    return {
      isFollowUp: true,
      intent: 'negative',
      message: "Understood. Whenever you seek guidance, I am here. Hare Krishna."
    };
  }

  // For any positive or ambiguous follow up, we proceed with fetching the new verse
  // context.md 4.3 says "If Yes -> Generate a new Core Response"
  return { isFollowUp: true, intent: 'positive' };
}

// 4. Post-LLM Format Validation
export function validateFormat(response) {
  if (!response || typeof response !== 'object') {
    return { isValid: false, reason: "Response is not a JSON object" };
  }

  // If the model returned an error directly in JSON
  if (response.error) return { isValid: false, reason: response.error };

  const requiredFields = ['shloka', 'translation', 'application', 'reflection'];
  for (const field of requiredFields) {
    if (!response[field]) {
      return { isValid: false, reason: `Missing required field: ${field}` };
    }
  }

  if (!response.shloka.devanagari && !response.shloka.roman) {
    return { isValid: false, reason: "Missing shloka text (devanagari or roman)" };
  }

  return { isValid: true };
}

// 5. Post-LLM Citation Validation (Hallucination check)
export function validateCitation(response, chromaMetadata) {
  if (!response.shloka || !response.shloka.chapter || !response.shloka.verse) {
    return { isValid: false }; // Missing citation data
  }

  const llmChapter = parseInt(response.shloka.chapter, 10);
  const llmVerse = parseInt(response.shloka.verse, 10);

  // Check if the LLM's cited verse was actually in our retrieved metadata
  let matchFound = false;
  for (const meta of chromaMetadata) {
    if (parseInt(meta.chapter, 10) === llmChapter && parseInt(meta.verse, 10) === llmVerse) {
      matchFound = true;
      break;
    }
  }

  return { isValid: matchFound };
}
