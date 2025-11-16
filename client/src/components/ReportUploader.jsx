import { useState } from 'react';

export default function ReportUploader({ onUpload }) {
  const [mode, setMode] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (mode === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        result = await onUpload(formData, 'file');
      } else if (mode === 'text' && textInput.trim()) {
        result = await onUpload({ text: textInput }, 'text');
      } else {
        setError('Please provide a file or text');
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Upload failed');
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Upload Medical Report</h2>
      
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 rounded-md ${mode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
        >
          Upload PDF
        </button>
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-2 rounded-md ${mode === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
        >
          Paste Text
        </button>
      </div>

      {mode === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-slate-600">
              {file ? (
                <p className="text-blue-600 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="font-medium">Drag & drop PDF here or click to browse</p>
                  <p className="text-sm mt-1">PDF files only, max 10MB</p>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {mode === 'text' && (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your medical report text here..."
          className="input-field min-h-[200px] font-mono text-sm"
        />
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (mode === 'file' && !file) || (mode === 'text' && !textInput.trim())}
        className="btn-blue w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Extract Text'}
      </button>
    </div>
  );
}
