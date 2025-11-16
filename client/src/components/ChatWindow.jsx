import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({ onSendMessage, messages, loading }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'How can I improve my sleep?',
    'What are healthy snack options?',
    'Tips for managing stress?'
  ];

  return (
    <div className="card flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-8">
            <p className="text-lg font-medium mb-2">Welcome to CareChat!</p>
            <p className="text-sm">Ask me about general health, wellness, or lifestyle questions.</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(sug)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-slate-600">Typing...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          className="input-field resize-none"
          rows="2"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-blue px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      <p className="disclaimer mt-2">
        Not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis or treatment.
      </p>
    </div>
  );
}
