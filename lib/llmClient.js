import OpenAI from "openai";

let openaiInstance = null;

function getOpenAI() {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }
  
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: groqApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return openaiInstance;
}

export async function generateResponse(systemPrompt, context, userQuery) {
  const openai = getOpenAI();

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Context (Verses and Purports):\n${context}\n\nUser Query: ${userQuery}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.3, // Low temperature for objective, deterministic responses
      max_tokens: 1024,
      response_format: { type: "json_object" }, // Enforce JSON response
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Received empty response from LLM.");
    }

    // Parse the JSON strictly
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}
