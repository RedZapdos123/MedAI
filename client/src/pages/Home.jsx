import { Link } from 'react-router-dom';

export default function Home() {
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
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 text-gradient-medical">
              MediGen + CareChat
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered medical report summarization and wellness support
            </p>
            <p className="disclaimer mt-4">
              ⚠️ For informational purposes only — not a substitute for professional medical advice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* MediGen Card */}
            <Link to="/medigen" className="group">
              <div className="card-green h-full transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-2xl font-bold mb-3 text-[var(--color-medical-green)]">
                  MediGen AI
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload or paste your medical report. Get a plain-language summary, key findings,
                  actionable recommendations, and FAQ-style explanations.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-green)]">✓</span> PDF or text input
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-green)]">✓</span> Patient-friendly summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-green)]">✓</span> Downloadable results
                  </li>
                </ul>
                <div className="mt-auto">
                  <span className="btn-green inline-block">Get Started →</span>
                </div>
              </div>
            </Link>

            {/* CareChat Card */}
            <Link to="/carechat" className="group">
              <div className="card-red h-full transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-2xl font-bold mb-3 text-[var(--color-medical-red)]">
                  CareChat
                </h3>
                <p className="text-gray-600 mb-4">
                  Chat with our AI assistant for general health information, lifestyle tips,
                  and mental wellness support with built-in safety filters.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-red)]">✓</span> General wellness guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-red)]">✓</span> Lifestyle suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-medical-red)]">✓</span> Crisis resource support
                  </li>
                </ul>
                <div className="mt-auto">
                  <span className="btn-red inline-block">Start Chat →</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Safety Notice */}
          <div className="text-center">
            <div className="card inline-block max-w-3xl">
              <h3 className="font-bold text-lg mb-3 text-gray-800">🛡️ Important Safety Notice</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This prototype is for demonstration purposes. It does not provide medical diagnoses,
                prescriptions, or emergency instructions. If you experience urgent symptoms or a
                medical emergency, call your local emergency services immediately.
              </p>
              <p className="text-xs text-[var(--color-medical-green)] mt-3 font-semibold">
                🎨 Created by Mridankan Mandal
              </p>
            </div>
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
