import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEYS = [
  'AIzaSyCqiHOLDMf_WlIyUCa1bX_-XMQ_7sKaBpA',
  'AIzaSyBuU_VMkH6AsKqm2AJOxS5D40jcCfZv2ks',
  'AIzaSyAfxRCB31CWA7XJMEIM6LTFMqHy9gqV_dI',
  'AIzaSyBCek4h3q4Tt--XzyQoW2VlN4vIQryqJdY'
].filter(Boolean);

const ACTIVE_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-exp'
];

let currentApiKeyIndex = 0;
let currentModelIndex = 0;

if (API_KEYS.length === 0) {
  console.warn('[geminiClient] No API keys configured');
} else {
  console.log(`[geminiClient] Initialized with ${API_KEYS.length} API keys and ${ACTIVE_MODELS.length} models`);
}

function getModel(modelName = null) {
  if (API_KEYS.length === 0) return null;
  const apiKey = API_KEYS[currentApiKeyIndex];
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = modelName || ACTIVE_MODELS[currentModelIndex];
  return genAI.getGenerativeModel({ model, generationConfig: { temperature: 0.3, topP: 0.95, topK: 40, maxOutputTokens: 2048 } });
}

export async function generateJson({ systemPrompt, userPrompt }) {
  const maxRetries = 9;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const geminiModel = getModel();
      if (!geminiModel) {
        console.warn('[geminiClient] No API keys available, using fallback');
        return getFallbackResponse(systemPrompt);
      }
      console.log(`[geminiClient] Attempting API call with key ${currentApiKeyIndex + 1}, model ${ACTIVE_MODELS[currentModelIndex]} (attempt ${attempt + 1}/${maxRetries})`);
      const result = await geminiModel.generateContent(systemPrompt + '\n\n' + userPrompt);
      let text = result.response.text().replace(/`json\n?/g, '').replace(/`\n?/g, '').replace(/###\s*/g, '').replace(/\*\*/g, '').replace(/^•\s*/gm, '').replace(/^\d+\.\s*/gm, '').trim();
      console.log('[geminiClient] ✅ Successfully generated JSON response from Gemini API');
      try { return JSON.parse(text); } catch { const m = text.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error('parse'); }
    } catch (err) {
      console.warn(`[geminiClient] Attempt ${attempt + 1} failed:`, err.message);
      console.error('[geminiClient] Full error:', err);
      currentModelIndex = (currentModelIndex + 1) % ACTIVE_MODELS.length;
      if (currentModelIndex === 0) currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
      attempt++;
      if (attempt >= maxRetries) {
        console.error('[geminiClient] ❌ All retry attempts exhausted, using fallback');
        return getFallbackResponse(systemPrompt);
      }
    }
  }
}

export async function generateText({ systemPrompt, userPrompt }) {
  const maxRetries = 9;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const geminiModel = getModel();
      if (!geminiModel) {
        console.warn('[geminiClient] No API keys available, using fallback text');
        return getFallbackText(systemPrompt);
      }
      console.log(`[geminiClient] Attempting text generation with key ${currentApiKeyIndex + 1}, model ${ACTIVE_MODELS[currentModelIndex]} (attempt ${attempt + 1}/${maxRetries})`);
      const result = await geminiModel.generateContent(systemPrompt + '\n\n' + userPrompt);
      const text = result.response.text().replace(/###\s*/g, '').replace(/\*\*/g, '').replace(/^•\s*/gm, '').replace(/^\d+\.\s*/gm, '').trim();
      console.log('[geminiClient] ✅ Successfully generated text response from Gemini API');
      return text;
    } catch (err) {
      console.warn(`[geminiClient] Text generation attempt ${attempt + 1} failed:`, err.message);
      console.error('[geminiClient] Full text error:', err);
      currentModelIndex = (currentModelIndex + 1) % ACTIVE_MODELS.length; 
      if (currentModelIndex === 0) currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length; 
      attempt++; 
      if (attempt >= maxRetries) {
        console.error('[geminiClient] ❌ All retry attempts exhausted, using fallback text');
        return getFallbackText(systemPrompt);
      }
    }
  }
}

function getFallbackResponse(sp) {
  if (sp.includes('MediGen')) return { summary: 'Consult your healthcare provider. These are general findings.', keyFindings: ['General results'], recommendations: ['See your doctor'], faq: [] };
  return { reply: 'Please consult a qualified healthcare provider.', sessionId: 'demo', moderation: { riskLevel: 'low' } };
}

function getFallbackText(sp) {
  return 'Please consult a qualified healthcare provider for medical advice.';
}
