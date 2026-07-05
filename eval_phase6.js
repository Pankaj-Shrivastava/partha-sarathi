import dotenv from "dotenv";
dotenv.config();

import chatHandler from "./api/chat.js";
import welcomeHandler from "./api/welcome.js";
import healthHandler from "./api/health.js";

// Mock Express req/res
function createMockRes(resolve) {
  const res = {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      resolve({ status: this.statusCode, data });
      return data;
    }
  };
  return res;
}

function callEndpoint(handler, req) {
  return new Promise((resolve) => {
    handler(req, createMockRes(resolve)).catch(err => resolve({ status: 500, error: err }));
  });
}

async function runEval() {
  console.log("# Phase 6 Programmatic Evaluation\n");

  // 6.1 Health check
  let res = await callEndpoint(healthHandler, { method: "GET" });
  console.log(`6.1 Health check: ${res.data.status === 'ok' && res.data.chromadb === 'connected' ? 'PASS' : 'FAIL'}`);

  // 6.2 & 6.5 - 6.8 Welcome endpoint checks
  let w1 = await callEndpoint(welcomeHandler, { method: "GET" });
  let w2 = await callEndpoint(welcomeHandler, { method: "GET" });
  let w3 = await callEndpoint(welcomeHandler, { method: "GET" });
  
  const wPass = w1.status === 200 && w1.data.type === "welcome" &&
                !!w1.data.shloka.devanagari && !!w1.data.translation && !!w1.data.shloka.citation;
  console.log(`6.2, 6.5-6.8 Welcome response structure: ${wPass ? 'PASS' : 'FAIL'}`);
  
  // 6.17 Randomness check
  const versesSet = new Set([w1.data.shloka.citation, w2.data.shloka.citation, w3.data.shloka.citation]);
  console.log(`6.17 Welcome randomness (unique verses out of 3 calls): ${versesSet.size} -> ${versesSet.size > 1 ? 'PASS' : 'FAIL'}`);

  // 6.4 Invalid method
  let invalidReq = await callEndpoint(chatHandler, { method: "GET" });
  console.log(`6.4 Invalid method rejected (GET /api/chat): ${invalidReq.status === 405 ? 'PASS' : 'FAIL'}`);

  // Chat tests
  const queries = [
    { id: "6.14", text: "I'm struggling with a career decision" },
    { id: "6.15", text: "How do I find peace of mind?" },
    { id: "6.16", text: "I feel angry at my coworker" }
  ];

  for (const q of queries) {
    console.log(`\nTesting Query: "${q.text}"`);
    let chatRes = await callEndpoint(chatHandler, {
      method: "POST",
      body: { message: q.text, sessionId: "test", isFollowUp: false }
    });

    if (chatRes.status !== 200) {
      console.log(`${q.id} -> FAIL (HTTP ${chatRes.status})`);
      console.log(chatRes);
      continue;
    }

    const d = chatRes.data;
    
    // 6.9 - 6.13 Structural checks
    const structPass = d.type === "shloka_response" &&
                       !!d.shloka && !!d.translation && !!d.application && !!d.reflection &&
                       !!d.shloka.devanagari &&
                       Array.isArray(d.sources) && d.sources.length > 0 &&
                       typeof d.sources[0].similarity === 'number';

    console.log(`${q.id} Structure (6.9-6.13): ${structPass ? 'PASS' : 'FAIL'}`);
    if (structPass) {
      console.log(`    Selected Verse: BG ${d.shloka.chapter}.${d.shloka.verse} (Score: ${d.sources[0].similarity.toFixed(2)})`);
      console.log(`    Application: ${d.application}`);
    }
  }
}

runEval().catch(console.error);
