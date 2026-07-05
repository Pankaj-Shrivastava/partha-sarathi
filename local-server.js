import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import chatHandler from './api/chat.js';
import welcomeHandler from './api/welcome.js';

config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// Helper to adapt Vercel Serverless Function to Express route
const adaptVercelHandler = (handler) => async (req, res) => {
  try {
    // Express res.status().json() is compatible with Vercel's res.status().json()
    await handler(req, res);
  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

app.post('/api/chat', adaptVercelHandler(chatHandler));
app.get('/api/welcome', adaptVercelHandler(welcomeHandler));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
});
