import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ChatWindow from '../components/ChatWindow';
import CrisisBanner from '../components/CrisisBanner';

export default function CareChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [crisisInfo, setCrisisInfo] = useState(null);
  const [persona, setPersona] = useState('general');

  const handleSendMessage = async (message) => {
    setLoading(true);
    setCrisisInfo(null);

    // Add user message
    const userMessage = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await apiClient.post('/api/chat', {
        sessionId,
        message,
        context: { persona }
      });

      if (response.data.crisis) {
        // Crisis response
        setCrisisInfo({
          resources: response.data.resources,
          text: response.data.text
        });
        const systemMessage = { 
          sender: 'system', 
          text: 'I\'ve detected that you may need immediate help. Please see the resources above.' 
        };
        setMessages(prev => [...prev, systemMessage]);
      } else {
        // Normal response
        const aiMessage = { sender: 'ai', text: response.data.reply };
        setMessages(prev => [...prev, aiMessage]);
        if (response.data.sessionId) {
          setSessionId(response.data.sessionId);
        }
      }
      setLoading(false);
    } catch (err) {
      const errorMessage = { 
        sender: 'system', 
        text: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSessionId(null);
    setCrisisInfo(null);
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-medical-red)] mb-2">CareChat</h1>
              <p className="text-slate-600">General health information and wellness support</p>
            </div>
            <Link to="/" className="text-[var(--color-medical-red)] hover:underline">
              ← Back to Home
            </Link>
          </div>

        {/* Persona selector */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Chat Mode</h3>
          <div className="flex gap-2">
            {['general', 'lifestyle', 'mental-wellness'].map(p => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`px-4 py-2 rounded-md capitalize ${
                  persona === p 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                {p.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {crisisInfo && (
          <CrisisBanner resources={crisisInfo.resources} text={crisisInfo.text} />
        )}

        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage}
          loading={loading}
        />

        {messages.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleClearChat}
              className="text-sm link-blue"
            >
              Clear conversation
            </button>
          </div>
        )}

        <div className="mt-6 card bg-slate-50">
          <h3 className="font-semibold mb-2 text-sm">Safety Reminder</h3>
          <p className="text-xs text-slate-600">
            CareChat provides general information only. It does not diagnose conditions, prescribe treatments, 
            or handle medical emergencies. For urgent symptoms, call emergency services immediately.
          </p>
        </div>
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
