import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  filename: { type: String },
  originalText: { type: String, required: true },
  summary: { type: String },
  keyFindings: [{ type: String }],
  recommendations: [{ type: String }],
  faq: [{
    q: { type: String },
    a: { type: String }
  }],
  meta: {
    patientName: { type: String },
    preview: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('MedicalReport', medicalReportSchema);
