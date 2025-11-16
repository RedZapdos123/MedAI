import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Simple health check endpoint.
 */
router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
