import http from 'http';
import dotenv from 'dotenv';
import { app } from './app.js';
import { initSocket } from './socket.js';
import { connectDB } from './utils/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Fatal start error', err);
  process.exit(1);
});
