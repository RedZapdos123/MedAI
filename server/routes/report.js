import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { extractTextFromPdf, extractTextFromPlain, sanitizeForPHI } from '../lib/extractor.js';
import { summarizeReport } from '../lib/summarizers.js';
import { detectPHI, postCheck } from '../lib/moderation.js';
import MedicalReport from '../models/MedicalReport.js';
import AuditLog from '../models/AuditLog.js';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/report/upload
 * Accepts multipart/form-data with PDF file or JSON with text field.
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    await AuditLog.create({ action: 'upload_started', details: { timestamp: new Date() } });

    let extractedData;

    if (req.file) {
      // PDF upload
      extractedData = await extractTextFromPdf(req.file.path);
      // Clean up temp file
      await fs.unlink(req.file.path).catch(err => console.warn('Failed to delete temp file:', err));
    } else if (req.body.text) {
      // Text paste
      extractedData = await extractTextFromPlain(req.body.text);
    } else {
      const error = new Error('No file or text provided');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    // Sanitize PHI
    const sanitized = sanitizeForPHI(extractedData.text);
    const phiCheck = detectPHI(extractedData.text);

    await AuditLog.create({ action: 'upload_extracted', details: { length: extractedData.estimatedLength, phiDetected: phiCheck.hasPHI } });

    res.json({
      text: sanitized,
      preview: extractedData.preview,
      estimatedLength: extractedData.estimatedLength,
      id: uuidv4()
    });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.statusCode = 413;
      err.code = 'LIMIT_EXCEEDED';
      err.message = 'File size exceeds limit';
    } else if (!err.statusCode) {
      err.statusCode = 500;
      err.code = 'SERVER_ERROR';
    }
    next(err);
  }
});

/**
 * POST /api/report/summarize
 * Accepts JSON with text and optional options.
 */
router.post('/summarize', async (req, res, next) => {
  try {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
      const error = new Error('Invalid request: text is required');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    await AuditLog.create({ action: 'summarize_requested', details: { textLength: text.length } });

    // Pre-moderation (optional for MediGen, but good practice)
    const phiCheck = detectPHI(text);
    if (phiCheck.hasPHI) {
      console.warn('[summarize] PHI detected in input, proceeding with sanitized text');
    }

    // Call summarizer
    const result = await summarizeReport(text, options);

    // Post-moderation
    const postCheckResult = postCheck(result.summary);
    if (!postCheckResult.ok) {
      console.warn('[summarize] Post-check failed:', postCheckResult.issues);
      // Return safe fallback
      result.summary = '⚠️ This summary is informational only — not medical advice. See your clinician for diagnosis and treatment.\n\nThe AI generated content that may not be appropriate. Please consult your healthcare provider directly with your original report.';
      result.keyFindings = ['AI response flagged for safety'];
      result.recommendations = ['Consult your clinician with the original report'];
    }

    // Optionally save to DB
    const report = await MedicalReport.create({
      originalText: text,
      summary: result.summary,
      keyFindings: result.keyFindings,
      recommendations: result.recommendations,
      faq: result.faq,
      meta: { preview: text.substring(0, 500) }
    });

    await AuditLog.create({ action: 'summarize_completed', details: { reportId: report._id } });

    res.json({
      summary: result.summary,
      keyFindings: result.keyFindings,
      recommendations: result.recommendations,
      faq: result.faq,
      reportId: report._id
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.code = 'MODEL_ERROR';
    }
    next(err);
  }
});

export default router;
