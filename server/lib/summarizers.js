import { generateJson, generateText } from './geminiClient.js';

/**
 * Build MediGen prompt, call Gemini, parse JSON output, add disclaimer.
 */
export async function summarizeReport(text, options = {}) {
  const systemPrompt = `You are MediGen — a medical-simplifier for patients. Convert clinical language into plain English understandable by a non-medical adult. Be concise, avoid jargon (or explain it in parentheses), highlight 3–6 key findings, provide 3 simple next-steps the patient may discuss with their clinician, and 3 FAQ-style Q&A items that a patient could ask their provider. 

CRITICAL FORMATTING RULES:
- Always use natural, flowing paragraphs for the summary
- NO markdown formatting (no ###, **, •, numbered lists)
- Write in conversational, clear language like you're speaking to a friend
- Always prepend the disclaimer as plain text

Always start with this disclaimer: "This summary is for informational purposes only and is not medical advice. Please consult your healthcare provider for diagnosis and treatment."

Output your response as JSON with these fields: summary (string with natural paragraphs), keyFindings (array of strings), recommendations (array of strings), faq (array of {q, a} objects).`;

  const userPrompt = text;

  const result = await generateJson({
    systemPrompt,
    userPrompt,
    model: 'gemini-1.5-flash',
    temperature: 0.3,
    maxOutputTokens: 1024
  });

  // Robust JSON parse if result is string
  let parsed = result;
  if (typeof result === 'string') {
    // Strip markdown code fences if present
    let cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('[summarizeReport] JSON parse error:', err);
      // Fallback safe response
      return {
        summary: '⚠️ This summary is informational only — not medical advice. See your clinician for diagnosis and treatment.\n\nUnable to parse AI response. Please try again or consult your healthcare provider directly.',
        keyFindings: ['Unable to extract findings'],
        recommendations: ['Consult your clinician with the original report'],
        faq: [{ q: 'What happened?', a: 'The AI response could not be processed. Please try again.' }]
      };
    }
  }

  return {
    summary: parsed.summary || '',
    keyFindings: parsed.keyFindings || [],
    recommendations: parsed.recommendations || [],
    faq: parsed.faq || []
  };
}

/**
 * Build CareChat prompt and call Gemini.
 */
export async function generateChatResponse(message, context = {}) {
  const systemPrompt = `You are CareChat — a friendly AI assistant for general medical information and wellness. 

CRITICAL RULES:
- DO NOT provide diagnoses, prescriptions, or emergency instructions
- Use natural, conversational paragraphs (NO markdown: no ###, **, •, numbered lists)
- Write like you're talking to a friend who needs health information
- If a user asks for medical diagnosis or presents urgent symptoms (chest pain, difficulty breathing, severe bleeding, suicidal ideation), respond with a crisis/referral message advising immediate medical attention
- Always emphasize you cannot replace professional medical advice
- Offer lifestyle suggestions and general wellness information when appropriate

Write all responses in flowing, natural language paragraphs. NO bullet points or numbered lists.`;

  let userPrompt = message;
  if (context.ageRange || context.basicConditions) {
    userPrompt += `\n[Context: Age range: ${context.ageRange || 'not specified'}, Conditions: ${context.basicConditions ? context.basicConditions.join(', ') : 'none'}]`;
  }

  const reply = await generateText({
    systemPrompt,
    userPrompt
  });

  return reply;
}
