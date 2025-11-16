import express from 'express';
import { detectRedFlags, postCheck } from '../lib/moderation.js';
import { generateChatResponse } from '../lib/summarizers.js';
import Conversation from '../models/Conversation.js';
import AuditLog from '../models/AuditLog.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const CRISIS_RESOURCES = [
  { name: 'Emergency Services', url: 'tel:911' },
  { name: '988 Suicide & Crisis Lifeline (US)', url: 'https://988lifeline.org/' },
  { name: 'Crisis Text Line', url: 'sms:741741', text: 'Text HOME to 741741' }
];

/**
 * POST /api/chat
 * Accepts JSON with message, optional sessionId and context.
 */
router.post('/', async (req, res, next) => {
  try {
    const { sessionId, message, context } = req.body;

    if (!message || typeof message !== 'string') {
      const error = new Error('Invalid request: message is required');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    await AuditLog.create({ action: 'chat_user', details: { sessionId, messageLength: message.length } });

    // Red-flag detection
    const redFlagCheck = detectRedFlags(message);
    if (redFlagCheck.matched) {
      await AuditLog.create({ action: 'moderation_flag', details: { terms: redFlagCheck.terms } });
      return res.json({
        crisis: true,
        resources: CRISIS_RESOURCES,
        text: 'If you or someone is in immediate danger, call emergency services (911 in the US) or your local emergency number now. For mental health support, contact the 988 Suicide & Crisis Lifeline.',
        moderation: { riskLevel: 'high' }
      });
    }

    // Generate AI response
    const reply = await generateChatResponse(message, context);

    // Post-check
    const postCheckResult = postCheck(reply);
    let finalReply = reply;
    if (!postCheckResult.ok) {
      console.warn('[chat] Post-check failed:', postCheckResult.issues);
      finalReply = 'I\'m here to provide general health information and wellness support. For specific medical advice, diagnosis, or treatment, please consult a qualified healthcare professional.';
    }

    // Save conversation (optional)
    let activeSessionId = sessionId || uuidv4();
    let conversation = await Conversation.findById(activeSessionId);
    if (!conversation) {
      conversation = await Conversation.create({
        _id: activeSessionId,
        type: 'carechat',
        messages: []
      });
    }
    conversation.messages.push({ sender: 'user', text: message });
    conversation.messages.push({ sender: 'ai', text: finalReply });
    await conversation.save();

    await AuditLog.create({ action: 'chat_ai', details: { sessionId: activeSessionId } });

    res.json({
      reply: finalReply,
      sessionId: activeSessionId,
      moderation: { riskLevel: 'low' }
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
