import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { fetchAssessmentBattery, analyzeSpeechAudio } from '../../services/api';
import { SpeechAnalysisResult } from '../../../server/db';
import { MainNavView } from '../navigation/Navbar';

interface AssessmentProps {
  setCurrentView: (view: MainNavView) => void;
}

export const AssessmentFlowView: React.FC<AssessmentProps> = ({ setCurrentView }) => {
  const { currentChild } = useAuth();
  const [battery, setBattery] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState<Record<number, SpeechAnalysisResult>>({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchAssessmentBattery().then(setBattery).catch(() => {});
  }, []);

  const currentItem = battery[currentIndex];

  const playExemplar = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      setEvaluating(true);
      try {
        const res = await analyzeSpeechAudio({
          childId: currentChild.id,
          targetWord: currentItem.wordHindi,
          targetPhoneme: currentItem.targetPhoneme,
          position: currentItem.position,
          audioDurationSeconds: 2.2,
          simulatedScenario: currentItem.wordHindi === 'कमल' ? 'substitution' : currentItem.wordHindi === 'सेब' ? 'distortion' : 'correct',
        });

        if (res.success) {
          setResults((prev) => ({ ...prev, [currentIndex]: res.result }));
        }
      } finally {
        setEvaluating(false);
      }
    }, 2000);
  };

  const nextItem = () => {
    if (currentIndex < battery.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  if (!currentItem && !completed) {
    return (
      <div className="flex justify-center p-12 text-slate-500">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-emerald-600" />
        <span>Loading 5-minute assessment battery...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Header in English */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>5-Minute Clinical Speech Screening Battery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Baseline Phonetic Articulation Assessment
        </h1>
      </div>

      {!completed ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Progress stepper */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600">
              Item {currentIndex + 1} of {battery.length}
            </span>
            <span className="text-emerald-700 font-bold font-mono">
              {Math.round(((currentIndex + 1) / battery.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / battery.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Word Card */}
          <div className="text-center py-6 space-y-3">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
              Target Sound: /{currentItem.targetPhoneme}/ ({currentItem.position} position)
            </span>
            <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-wide">
              {currentItem.wordHindi}
            </div>
            <div className="text-xs font-mono text-slate-500 font-medium">
              {currentItem.audioExemplarText}
            </div>

            <div className="pt-2">
              <button
                onClick={() => playExemplar(currentItem.wordHindi)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Listen to Standard Pronunciation</span>
              </button>
            </div>
          </div>

          {/* Recording Action Bar */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-4 border-t border-slate-100">
            {isRecording ? (
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span>Listening... Please pronounce clearly</span>
              </div>
            ) : evaluating ? (
              <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Evaluating phonetic likelihood...</span>
              </div>
            ) : results[currentIndex] ? (
              <div className="space-y-4 w-full">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {results[currentIndex].isMatch ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <span className="text-xs font-bold text-slate-800">
                      {results[currentIndex].isMatch ? 'Clear Articulation' : 'Acoustic Substitution Detected'}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-emerald-700 font-bold">
                    GOP: {results[currentIndex].gopScore.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={nextItem}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <span>{currentIndex < battery.length - 1 ? 'Next Word' : 'Complete Assessment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleRecord}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-md transition-all hover:scale-102"
              >
                <Mic className="w-4 h-4" />
                <span>Tap to Record & Assess Word</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completed Summary Report */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-black text-slate-900">Assessment Completed Successfully!</h2>
              <p className="text-xs text-slate-500">
                Aarav's Bayesian Speech Digital Twin has been recalibrated.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average Clarity</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">74%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sound Strengths</div>
              <div className="text-2xl font-black text-slate-900 mt-1">प, त, ब</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Primary Practice Area</div>
              <div className="text-2xl font-black text-amber-600 mt-1">क, स</div>
            </div>
          </div>

          {/* Clinical Stance / PR-02 reminder in English */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Clinical Advisory (PR-02): </span>
              This screening provides educational practice metrics and does not constitute a medical diagnosis. Please consult your assigned Speech Pathologist Dr. Neha Verma for clinical treatment planning.
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setCurrentView('practice_arena')}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Start Recommended Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              View Digital Twin Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
