import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ReportUploader from '../components/ReportUploader';
import SummaryView from '../components/SummaryView';

export default function MediGen() {
  const [extractedText, setExtractedText] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (data, mode) => {
    setError(null);
    setLoading(true);
    try {
      const config = mode === 'file' 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      
      const response = await apiClient.post('/api/report/upload', data, config);
      setExtractedText(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Upload failed');
      setLoading(false);
      throw err;
    }
  };

  const handleSummarize = async () => {
    if (!extractedText) return;
    
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/api/report/summarize', {
        text: extractedText.text,
        options: { language: 'en', depth: 'short' }
      });
      setSummary(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Summarization failed');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    
    const text = `MEDICAL REPORT SUMMARY\n\n${summary.summary}\n\nKEY FINDINGS:\n${summary.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nRECOMMENDATIONS:\n${summary.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nFAQ:\n${summary.faq.map(item => `Q: ${item.q}\nA: ${item.a}`).join('\n\n')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-report-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setExtractedText(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏥</div>
            <h1 className="text-2xl font-bold text-gradient-medical">MedAI</h1>
          </div>
          <div className="avatar" title="Created by Mridankan Mandal">MM</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-medical-green)] mb-2">MediGen AI</h1>
              <p className="text-slate-600">Upload and summarize medical reports in plain language</p>
            </div>
            <Link to="/" className="text-[var(--color-medical-green)] hover:underline">
              ← Back to Home
            </Link>
          </div>

        {!extractedText && !summary && (
          <ReportUploader onUpload={handleUpload} />
        )}

        {extractedText && !summary && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-semibold mb-3">Extracted Text Preview</h2>
              <div className="bg-slate-50 p-4 rounded-md max-h-64 overflow-y-auto">
                <p className="text-sm font-mono text-slate-700 whitespace-pre-wrap">
                  {extractedText.preview}
                  {extractedText.text.length > 500 && '...'}
                </p>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Length: {extractedText.estimatedLength} characters
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="btn-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Summarizing...' : '✨ Summarize Report'}
              </button>
              <button onClick={handleReset} className="btn-primary bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500">
                Reset
              </button>
            </div>
          </div>
        )}

        {summary && (
          <div>
            <div className="mb-4">
              <button onClick={handleReset} className="link-blue">
                ← Upload another report
              </button>
            </div>
            <SummaryView summary={summary} onDownload={handleDownload} />
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Processing...</p>
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            MedAI: 2025 • Creating safer, healthier digital healthcare experiences with AI
          </p>
          <p className="text-xs text-[var(--color-medical-green)] mt-1 font-medium">
            Created by Mridankan Mandal
          </p>
        </div>
      </footer>
    </div>
  );
}
