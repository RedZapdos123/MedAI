import { useState } from 'react';

export default function SummaryView({ summary, onDownload }) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const copyToClipboard = () => {
    const text = `MEDICAL REPORT SUMMARY\n\n${summary.summary}\n\nKEY FINDINGS:\n${summary.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nRECOMMENDATIONS:\n${summary.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-900 text-sm font-medium">
          ⚠️ This is an automatic summary for informational purposes only — not medical advice. Consult your clinician for diagnosis and treatment.
        </p>
      </div>

      {/* Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Plain-Language Summary</h2>
        <p className="text-slate-700 whitespace-pre-wrap">{summary.summary}</p>
      </div>

      {/* Key Findings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Key Findings</h2>
        <ul className="space-y-2">
          {summary.keyFindings.map((finding, idx) => (
            <li key={idx} className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                {idx + 1}
              </span>
              <span className="text-slate-700">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
        <ul className="space-y-2">
          {summary.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start">
              <span className="inline-block w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                {idx + 1}
              </span>
              <span className="text-slate-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      {summary.faq && summary.faq.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {summary.faq.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-md">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex justify-between items-center"
                >
                  <span className="font-medium text-slate-800">{item.q}</span>
                  <span className="text-slate-400">{expandedFAQ === idx ? '−' : '+'}</span>
                </button>
                {expandedFAQ === idx && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-700">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={copyToClipboard} className="btn-blue">
          📋 Copy Summary
        </button>
        <button onClick={onDownload} className="btn-primary bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500">
          ⬇️ Download TXT
        </button>
      </div>
    </div>
  );
}
