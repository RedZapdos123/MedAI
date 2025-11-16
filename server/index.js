import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import { limiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import reportRoutes from './routes/report.js';
import chatRoutes from './routes/chat.js';
import healthcheckRoutes from './routes/healthcheck.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medai';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Ensure tmp and upload directories exist
const tmpDir = process.env.TMP_DIR || './tmp';
const uploadDir = process.env.UPLOAD_DIR || './uploads';

await fs.mkdir(tmpDir, { recursive: true });
await fs.mkdir(uploadDir, { recursive: true });

// Middleware
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Routes
app.use('/api/report', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/health', healthcheckRoutes);

// Error handler (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully');
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
      console.log(`[Server] CLIENT_ORIGIN: ${CLIENT_ORIGIN}`);
      console.log('[Server] Gemini API: Using 4 API keys with 2 models (8 combinations)');
    });
  })
  .catch(err => {
    console.error('[MongoDB] Connection error:', err);
    process.exit(1);
  });
