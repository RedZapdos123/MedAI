/**
 * Moderation helpers for detecting unsafe content and PHI.
 */

const RED_FLAG_KEYWORDS = [
  'chest pain',
  'shortness of breath',
  'difficulty breathing',
  'stroke',
  'unconscious',
  'suicide',
  'suicidal',
  'harm myself',
  'kill myself',
  'severe bleeding',
  'loss of consciousness',
  'heart attack',
  'can\'t breathe',
  'overdose'
];

/**
 * Detect red-flag urgent symptom keywords in user input.
 */
export function detectRedFlags(text) {
  const lowerText = text.toLowerCase();
  const matched = RED_FLAG_KEYWORDS.some(keyword => lowerText.includes(keyword));
  const terms = RED_FLAG_KEYWORDS.filter(keyword => lowerText.includes(keyword));
  return { matched, terms };
}

/**
 * Detect PHI patterns (email, phone, SSN) in text.
 */
export function detectPHI(text) {
  const matches = [];
  // Email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails) {
    emails.forEach(email => matches.push({ type: 'email', value: email }));
  }
  // Phone
  const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const phones = text.match(phoneRegex);
  if (phones) {
    phones.forEach(phone => matches.push({ type: 'phone', value: phone }));
  }
  // SSN
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = text.match(ssnRegex);
  if (ssns) {
    ssns.forEach(ssn => matches.push({ type: 'ssn', value: ssn }));
  }

  return { hasPHI: matches.length > 0, matches };
}

/**
 * Post-check LLM output for disallowed medical content.
 * Returns issues if found.
 */
export function postCheck(content) {
  const issues = [];
  const lowerContent = content.toLowerCase();

  // Check for definitive diagnosis language
  if (lowerContent.includes('you have') || lowerContent.includes('diagnosed with')) {
    issues.push('Definitive diagnosis detected');
  }

  // Check for medication dosing specifics
  if (/\d+\s?(mg|ml|mcg|tablets?|pills?)/i.test(content)) {
    issues.push('Specific medication dosing detected');
  }

  // Check for imperative treatment directives
  if (lowerContent.includes('you must') || lowerContent.includes('you should take')) {
    issues.push('Definitive treatment directive detected');
  }

  return { ok: issues.length === 0, issues };
}
