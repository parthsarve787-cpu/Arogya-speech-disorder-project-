import React, { useState } from 'react';
import { MainNavView } from '../navigation/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Mic, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  Play, 
  User,
  Bot,
  BarChart3,
  HeartHandshake
} from 'lucide-react';

interface LandingPageProps {
  setCurrentView: (view: MainNavView) => void;
}

export const LandingPageView: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const { setAuthModalOpen, setAuthModalMode } = useAuth();
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const sampleWords = [
    { word: 'कमल', meaning: 'Lotus', phoneme: '/k/', category: 'Velar Sound' },
    { word: 'पानी', meaning: 'Water', phoneme: '/p/', category: 'Bilabial Sound' },
    { word: 'तितली', meaning: 'Butterfly', phoneme: '/t/', category: 'Dental Sound' },
    { word: 'सेब', meaning: 'Apple', phoneme: '/s/', category: 'Sibilant Sound' },
    { word: 'घर', meaning: 'House', phoneme: '/ɡʱ/', category: 'Aspirated Sound' },
    { word: 'सूरज', meaning: 'Sun', phoneme: '/s/', category: 'Sibilant Sound' },
  ];

  const playExemplar = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingWord(word);
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'hi-IN';
      u.rate = 0.85;
      u.onend = () => setPlayingWord(null);
      u.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section: Two-Column Layout (Left: Core Features & Action Points, Right: Interactive Practice Preview) */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Features & Presentation inspired by Speech Therapist Brand Portfolio */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pediatric Speech Therapy & Hindi Articulation</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Helping Hindi-speaking children speak with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">clarity and confidence</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Clinical-grade speech therapy tailored for native Hindi articulation. Empowering pediatric patients with playful micro-practice, Bayesian progress twins, and certified RCI-SLP oversight.
              </p>

              {/* 3 Core Line Features Showcase on the Left Side */}
              <div className="space-y-3 pt-2">
                
                {/* Feature 1 */}
                <div 
                  onClick={() => setCurrentView('practice_arena')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex items-start space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    🌱
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">Interactive Sound Garden</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Practice</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      10-minute micro-dosing with real-time acoustic feedback and blooming reward flora.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 self-center transition-colors" />
                </div>

                {/* Feature 2 */}
                <div 
                  onClick={() => setCurrentView('ai_conversation')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer flex items-start space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    🤖
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">Mitri AI Buddy & Speech Twin</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">AI Twin</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Conversational Hindi partner modeling initial, medial, and final phoneme masteries.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 self-center transition-colors" />
                </div>

                {/* Feature 3 */}
                <div 
                  onClick={() => setCurrentView('parent_portal')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer flex items-start space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    🛡️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">SLP Oversight & 24h Audio Vault</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">DPDP Act</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Verified parental consent, certified tele-therapist reviews, and auto-purged audio.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 self-center transition-colors" />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98"
                >
                  <User className="w-4 h-4" />
                  <span>Signup / Login / Signin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentView('practice_arena')}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs transition-all hover:border-slate-300"
                >
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span>Try Practice Arena</span>
                </button>
              </div>

              {/* Privacy Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>24h Ephemeral Vault</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>RCI-SLP Supervised</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Parental Consent</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Speech Visualizer & Live Soundcard */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white to-emerald-50/40 border border-slate-200/90 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-xs">
                      🗣️
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Hindi Target Phonetics</div>
                      <div className="text-[10px] text-slate-500">Tap to listen natural voice</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Live Demo
                  </span>
                </div>

                {/* Grid of sample words */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {sampleWords.map((item) => (
                    <div
                      key={item.word}
                      onClick={() => playExemplar(item.word)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        playingWord === item.word
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                          : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      <div className="text-lg font-black">{item.word}</div>
                      <div className={`text-[11px] font-bold ${playingWord === item.word ? 'text-emerald-100' : 'text-emerald-600'}`}>
                        {item.phoneme}
                      </div>
                      <div className={`text-[10px] ${playingWord === item.word ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {item.meaning}
                      </div>
                      <div className="mt-1 flex items-center justify-center">
                        <Volume2 className={`w-3.5 h-3.5 ${playingWord === item.word ? 'animate-bounce text-white' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Practice Mini Banner */}
                <div className="p-3.5 rounded-2xl bg-emerald-600 text-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black">Child Practice Routine</div>
                    <div className="text-[11px] text-emerald-100">Daily 10-minute articulation quest</div>
                  </div>
                  <button
                    onClick={() => setCurrentView('practice_arena')}
                    className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-black hover:bg-emerald-50 transition-colors"
                  >
                    Start
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Core Platform Features Section in Three Lines */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-left space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <span>✨ Complete Clinical Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Features</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered specifically to solve the domain gap in child speech and Hindi phonetics with clinical excellence.
          </p>
        </div>

        {/* 3 Clear Lines of Features */}
        <div className="space-y-3.5">
          {/* Line 1: Practice & Interactive Sound Garden */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🌱
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Line 1 · Interactive Practice</span>
                  <span className="text-xs text-emerald-600 font-bold">10-Min Micro-Dosing</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Gamified Sound Garden & Native Hindi Phonetics
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  Real-time microphone articulation converts correctly pronounced Devanagari phonemes into blooming virtual plants, keeping children motivated and engaged.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setCurrentView('practice_arena')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Practice Arena</span>
              </button>
              <button
                onClick={() => setCurrentView('child_dashboard')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                Sound Garden
              </button>
            </div>
          </div>

          {/* Line 2: AI Voice Companion & Bayesian Twin Intelligence */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🤖
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700">Line 2 · AI & Analytics</span>
                  <span className="text-xs text-teal-600 font-bold">Gemini 3.8 Flash Powered</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Mitri AI Voice Companion & Bayesian Speech Twin
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  Conversational companion talks in natural encouraging Hindi while mathematical Bayesian models map Initial, Medial, and Final sound mastery.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setCurrentView('ai_conversation')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chat with Mitri</span>
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                Speech Twin
              </button>
            </div>
          </div>

          {/* Line 3: Clinical Oversight, Parent Portal & Privacy Protection */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🛡️
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700">Line 3 · Clinical & Privacy</span>
                  <span className="text-xs text-sky-600 font-bold">RCI-SLP Supervised · DPDP Act 2023</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  SLP Tele-Supervision, Parental Controls & Ephemeral Audio Vault
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  Speech pathologists review pronunciation likelihoods and customize therapy, while parents maintain 100% consent control with 24-hour auto-purging voice vault.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setCurrentView('parent_portal')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Parent Portal</span>
              </button>
              <button
                onClick={() => setCurrentView('therapist_portal')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                SLP Portal
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
