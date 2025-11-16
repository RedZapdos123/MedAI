import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Allow UUID strings instead of ObjectId
  type: { type: String, default: 'carechat' },
  messages: [{
    sender: { type: String, enum: ['user', 'ai', 'system'], required: true },
    text: { type: String, required: true },
    analysisMeta: { type: mongoose.Schema.Types.Mixed }
  }]
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
