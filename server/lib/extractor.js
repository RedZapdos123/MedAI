import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

/**
 * Extract text from PDF file or buffer using pdf-parse.
 * Fallback to OCR stub if extraction is empty.
 */
export async function extractTextFromPdf(filePathOrBuffer) {
  let dataBuffer;
  if (typeof filePathOrBuffer === 'string') {
    dataBuffer = await fs.readFile(filePathOrBuffer);
  } else {
    dataBuffer = filePathOrBuffer;
  }

  const data = await pdfParse(dataBuffer);
  let text = data.text.trim();

  // TODO: If text is empty and OCR is needed, call tesseract.js here
  // Example:
  // if (!text) {
  //   const Tesseract = await import('tesseract.js');
  //   const { data: { text: ocrText } } = await Tesseract.recognize(dataBuffer, 'eng');
  //   text = ocrText.trim();
  // }

  const preview = text.substring(0, 500);
  const estimatedLength = text.length;

  return { text, preview, estimatedLength };
}

/**
 * Extract text from plain text input.
 */
export async function extractTextFromPlain(text) {
  const trimmed = text.trim();
  const preview = trimmed.substring(0, 500);
  const estimatedLength = trimmed.length;
  return { text: trimmed, preview, estimatedLength };
}

/**
 * Lightweight PHI sanitization for prototype.
 * Redacts emails, phone numbers, and SSNs with simple regex.
 */
export function sanitizeForPHI(text) {
  let sanitized = text;
  // Email
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
  // Phone (simple US pattern)
  sanitized = sanitized.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE_REDACTED]');
  // SSN
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
  return sanitized;
}
