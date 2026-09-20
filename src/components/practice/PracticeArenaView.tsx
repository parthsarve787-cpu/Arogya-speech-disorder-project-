import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Mic, 
  Square, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  ArrowRight, 
  ShieldAlert, 
  Award, 
  Sliders 
} from 'lucide-react';
import { analyzeSpeechAudio, deleteAudioRecording } from '../../services/api';
import { SpeechAnalysisResult } from '../../../server/db';
import { syncAnalysisToFirestore } from '../../lib/firestoreSync';

export const PracticeArenaView: React.FC = () => {
  const { currentChild, currentUser } = useAuth();
  
  // Practice Words catalog
  const practiceCatalog = [
    { word: 'कमल', phoneme: 'k', position: 'initial' as const, meaning: 'Lotus', roman: 'kamal', hint: 'Place the back of your tongue against your soft palate.' },
    { word: 'पानी', phoneme: 'p', position: 'initial' as const, meaning: 'Water', roman: 'paani', hint: 'Press both lips together gently and release a puff of air.' },
    { word: 'तितली', phoneme: 't', position: 'initial' as const, meaning: 'Butterfly', roman: 'titli', hint: 'Touch the tip of your tongue just behind your top front teeth.' },
    { word: 'सेब', phoneme: 's', position: 'initial' as const, meaning: 'Apple', roman: 'seb', hint: 'Let the air hiss gently through your front teeth like a friendly snake.' },
    { word: 'मकान', phoneme: 'k', position: 'medial' as const, meaning: 'House', roman: 'makaan', hint: 'Focus on the middle /k/ sound cleanly inside the word.' },
    { word: 'सड़क', phoneme: 's', position: 'initial' as const, meaning: 'Road', roman: 'sadak', hint: 'Start with a crisp /s/ before transitioning to /d/.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'repeat' | 'minimal'>('flashcard');
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [result, setResult] = useState<SpeechAnalysisResult | null>(null);
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);
  const [simulatedScenario, setSimulatedScenario] = useState<'correct' | 'substitution' | 'distortion'>('correct');

  const currentItem = practiceCatalog[currentIndex];

  const playNativeExemplar = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(true);
      const u = new SpeechSynthesisUtterance(currentItem.word);
      u.lang = 'hi-IN';
      u.rate = 0.82;
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setResult(null);
    setFeedbackDismissed(false);

    // Simulate 2.5s recording interval with live soundwave animation
    setTimeout(async () => {
      setIsRecording(false);
      setAnalyzing(true);

      try {
        const response = await analyzeSpeechAudio({
          childId: currentChild.id,
          targetWord: currentItem.word,
          targetPhoneme: currentItem.phoneme,
          position: currentItem.position,
          audioDurationSeconds: 2.2,
          simulatedScenario,
        });

        if (response.success && response.result) {
          setResult(response.result);
          // Persist to Cloud Firestore
          syncAnalysisToFirestore(response.result).catch(() => {});
        }
      } catch (err) {
        console.error('Speech analysis failed:', err);
      } finally {
        setAnalyzing(false);
      }
    }, 2500);
  };

  const handleHardDeleteAudio = async () => {
    if (!result) return;
    try {
      await deleteAudioRecording(result.recordingId, currentUser.id);
      setResult((prev) => (prev ? { ...prev, isPurged: true } : null));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % practiceCatalog.length);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Speech Practice Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Real-Time Articulation & Phoneme Alignment
          </h1>
        </div>

        {/* Practice Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start text-xs font-bold">
          <button
            onClick={() => setPracticeMode('flashcard')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              practiceMode === 'flashcard' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Word Flashcard
          </button>
          <button
            onClick={() => setPracticeMode('repeat')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              practiceMode === 'repeat' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Listen & Repeat
          </button>
        </div>
      </div>

      {/* Main Flashcard Exercise Container */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
        
        {/* Phoneme Category Pill */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Target Sound: /{currentItem.phoneme}/ ({currentItem.position} position)
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Exercise {currentIndex + 1} of {practiceCatalog.length}
          </span>
        </div>

        {/* Big Devanagari Target Word */}
        <div className="py-4 space-y-2">
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-wide select-none">
            {currentItem.word}
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono">
            {currentItem.roman} · <span className="text-slate-500 font-normal">{currentItem.meaning}</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto pt-1 font-medium">
            💡 {currentItem.hint}
          </p>
        </div>

        {/* Native Exemplar Audio Button */}
        <div className="flex justify-center">
          <button
            onClick={playNativeExemplar}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold flex items-center space-x-2 transition-all hover:scale-102"
          >
            <Volume2 className={`w-4 h-4 text-emerald-600 ${isPlayingAudio ? 'animate-pulse text-emerald-700' : ''}`} />
            <span>Listen to Standard Exemplar</span>
          </button>
        </div>

        {/* Dynamic Voice Recording Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
          {isRecording ? (
            <div className="space-y-3">
              {/* Animated Sound Waveform */}
              <div className="flex items-center justify-center space-x-1.5 h-12">
                {[40, 75, 95, 60, 85, 100, 70, 90, 50, 80, 65, 45].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-emerald-500 rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                  ></div>
                ))}
              </div>
              <div className="text-sm font-black text-emerald-700 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Listening... Speak clearly now!</span>
              </div>
            </div>
          ) : analyzing ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 py-4">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing phoneme alignment & Goodness-of-Pronunciation (GOP)...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleStartRecording}
                className="px-8 py-4 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center space-x-3 shadow-lg shadow-emerald-600/25 transition-all hover:scale-103 active:scale-98"
              >
                <Mic className="w-5 h-5" />
                <span>Tap to Speak & Record (बोलें)</span>
              </button>

              {/* SLP Testing Simulator Scenario Switcher */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 justify-center">
                <span>Simulation mode:</span>
                <select
                  value={simulatedScenario}
                  onChange={(e) => setSimulatedScenario(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-[11px]"
                >
                  <option value="correct">Accurate Articulation (/k/ → [k])</option>
                  <option value="substitution">Velar Fronting (/k/ → [t])</option>
                  <option value="distortion">Phonetic Distortion</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Result Card */}
      {result && !feedbackDismissed && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              {result.isMatch ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {result.isMatch ? 'Splendid Articulation! 🌸' : 'Good Try! Needs Gentle Adjustment'}
                </h3>
                <p className="text-xs text-slate-500">
                  Phonetic evaluation via wav2vec 2.0 CTC and GOP likelihood scoring
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {Math.round(result.gopScore * 100)}%
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">Acoustic Confidence</div>
            </div>
          </div>

          {/* Granular Phoneme Alignment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Child-Friendly Feedback
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {result.childFeedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Clinical Observation (SLP Audit)
              </span>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {result.therapistNotes}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleHardDeleteAudio}
              className="px-3.5 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hard-Delete Audio PCM (DPDP Right to Erasure)</span>
            </button>

            <button
              onClick={handleNextWord}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>Next Practice Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
