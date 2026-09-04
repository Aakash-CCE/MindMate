import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiApp } from './server/api.js';
import { setupLiveWebSocketServer } from './server/live.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API routes
app.use('/api', apiApp);

// Production static assets
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = http.createServer(app);
setupLiveWebSocketServer(server);

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`MindMate application running on port ${PORT}`);
});
