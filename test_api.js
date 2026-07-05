import dotenv from "dotenv";
dotenv.config();

import chatHandler from "./api/chat.js";
import welcomeHandler from "./api/welcome.js";
import healthHandler from "./api/health.js";

// Mock Express req/res
function createMockRes() {
  const res = {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log(`[Status: ${this.statusCode}] Response:`, JSON.stringify(data, null, 2));
      return data;
    }
  };
  return res;
}

async function runTests() {
  console.log("--- Testing /api/health ---");
  await healthHandler({ method: "GET" }, createMockRes());

  console.log("\n--- Testing /api/welcome ---");
  await welcomeHandler({ method: "GET" }, createMockRes());

  console.log("\n--- Testing /api/chat ---");
  const chatReq = {
    method: "POST",
    body: {
      message: "What is my duty in life?",
      sessionId: "test-session-123",
      isFollowUp: false
    }
  };
  await chatHandler(chatReq, createMockRes());
}

runTests().catch(console.error);
