import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
const max = parseInt(process.env.RATE_LIMIT_MAX) || 60;

export const limiter = rateLimit({
  windowMs,
  max,
  message: { error: { code: 'LIMIT_EXCEEDED', message: 'Too many requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false
});
