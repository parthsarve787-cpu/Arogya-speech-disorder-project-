import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  User, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  Star,
  Activity,
  Heart
} from 'lucide-react';

interface TargetWord {
  id: string;
  hindi: string;
  meaning: string;
  expectedPhonemes: string[];
  targetPhoneme: string;
  difficulty: string;
  sampleAudioText: string;
}

const TARGET_WORDS: TargetWord[] = [
  {
    id: 'w1',
    hindi: 'कमल',
    meaning: 'Lotus',
    expectedPhonemes: ['k', 'm', 'l'],
    targetPhoneme: 'k (क - Velar stop)',
    difficulty: 'Beginner',
    sampleAudioText: 'कमल (ka-ma-la)',
  },
  {
    id: 'w2',
    hindi: 'पानी',
    meaning: 'Water',
    expectedPhonemes: ['p', 'a', 'n', 'i'],
    targetPhoneme: 'p (प - Bilabial stop)',
    difficulty: 'Beginner',
    sampleAudioText: 'पानी (paa-nee)',
  },
  {
    id: 'w3',
    hindi: 'सेब',
    meaning: 'Apple',
    expectedPhonemes: ['s', 'e', 'b'],
    targetPhoneme: 's (स - Dental fricative)',
    difficulty: 'Intermediate (Minimal pair)',
    sampleAudioText: 'सेब (se-ba)',
  },
  {
    id: 'w4',
    hindi: 'तितली',
    meaning: 'Butterfly',
    expectedPhonemes: ['t', 'i', 't', 'l', 'i'],
    targetPhoneme: 't (त - Dental stop)',
    difficulty: 'Intermediate',
    sampleAudioText: 'तितली (tit-lee)',
  },
];

export const InteractivePrototypeView: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<TargetWord>(TARGET_WORDS[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [simulationMode, setSimulationMode] = useState<'correct' | 'substitution' | 'omission' | 'distortion'>('correct');
  const [activeRoleView, setActiveRoleView] = useState<'child' | 'parent' | 'therapist'>('child');
  const [audioDeleted, setAudioDeleted] = useState<boolean>(false);
  const [therapistOverridden, setTherapistOverridden] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Start recording timer
  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setIsAnalyzing(false);
    setAudioDeleted(false);
    setTherapistOverridden(false);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 3) {
          handleStopRecording();
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsAnalyzing(true);

    // Simulate backend inference pipeline
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasRecorded(true);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Compute simulated result depending on simulationMode
  const getAnalysisResult = () => {
    if (simulationMode === 'correct') {
      return {
        status: 'Match',
        confidence: 0.92,
        gop: 0.88,
        producedPhonemes: selectedWord.expectedPhonemes,
        errorType: null,
        stars: 3,
        childMessage: 'शानदार उच्चारण! आपने बिल्कुल सही बोला! 🌟',
        parentMessage: `उच्चारण बहुत अच्छा रहा (${(0.92 * 100).toFixed(0)}% आत्मविश्वास). ध्वनि '${selectedWord.expectedPhonemes[0]}' का अभ्यास पूरा हुआ।`,
        reason: 'दैनिक योजना का अगला अभ्यास: ध्वनि का शब्द के बीच में उपयोग करना।',
      };
    } else if (simulationMode === 'substitution') {
      const produced = [...selectedWord.expectedPhonemes];
      produced[0] = 't'; // e.g. /t/ instead of /k/
      return {
        status: 'Substitution Detected',
        confidence: 0.86,
        gop: 0.42,
        producedPhonemes: produced,
        errorType: `Substitution: /${selectedWord.expectedPhonemes[0]}/ → /${produced[0]}/`,
        stars: 2,
        childMessage: 'बहुत अच्छा प्रयास! अब आवाज़ को थोड़ा और साफ़ बोलने की कोशिश करें! 🌸',
        parentMessage: `बच्चे ने '${selectedWord.expectedPhonemes[0]}' के स्थान पर '${produced[0]}' की ध्वनि निकाली। यह एक सामान्य उच्चारण बदलाव है।`,
        reason: 'अगला अभ्यास: न्यूनतम अंतर वाले शब्दों (Minimal Pairs) की पहचान।',
      };
    } else if (simulationMode === 'omission') {
      const produced = selectedWord.expectedPhonemes.slice(1);
      return {
        status: 'Omission Detected',
        confidence: 0.84,
        gop: 0.28,
        producedPhonemes: produced,
        errorType: `Omission: Target /${selectedWord.expectedPhonemes[0]}/ was omitted`,
        stars: 2,
        childMessage: 'बहुत बढ़िया कोशिश! शब्द की पहली आवाज़ को ज़ोर से बोलिए! ⭐',
        parentMessage: `शब्द की शुरुआती ध्वनि '${selectedWord.expectedPhonemes[0]}' छूट गई।`,
        reason: 'अगला अभ्यास: एकाकी ध्वनि (Phoneme isolation) का 3 बार अभ्यास।',
      };
    } else {
      return {
        status: 'Possible Distortion Flagged',
        confidence: 0.68,
        gop: 0.35,
        producedPhonemes: selectedWord.expectedPhonemes,
        errorType: 'Possible Distortion (Low GOP: low acoustic likelihood without substitution token)',
        stars: 2,
        childMessage: 'शाबाश! आपने बहुत मेहनत की! आइए फिर से सुनते हैं! 🌼',
        parentMessage: `ध्वनि में हल्का अस्पष्टता देखी गई (आत्मविश्वास 68%)। चिकित्सक द्वारा समीक्षा की जा सकती है।`,
        reason: 'अगला अभ्यास: शिक्षक की आवाज़ को ध्यान से सुनकर दोहराना।',
      };
    }
  };

  const result = getAnalysisResult();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive System Sandbox · End-to-End Core Loop</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AarogyaSpeech AI Live Audio Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Test how the system prompts Hindi target vocabulary, processes speech, computes Goodness of Pronunciation (GOP), and renders role-scaled views (Child garden view vs Parent oversight vs Therapist clinical heatmap).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-stone-850 border border-stone-800 p-2.5 rounded-xl text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-300 font-medium">Verified Parent Consent Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Word Selection & Simulation Profile Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              1. Select Hindi Practice Target
            </h3>
            <p className="text-xs text-stone-400">
              Closed vocabulary from curated Devanagari item bank (§12, A-03).
            </p>
          </div>

          {/* Pronunciation Scenario Selector */}
          <div className="flex items-center space-x-1.5 bg-stone-850 px-2.5 py-1 rounded-xl border border-stone-800 text-xs">
            <span className="text-stone-400 text-[11px]">Simulate Pronunciation:</span>
            <select
              value={simulationMode}
              onChange={(e) => {
                setSimulationMode(e.target.value as any);
                setHasRecorded(false);
              }}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="correct" className="bg-stone-900 text-white">Scenario A: Accurate Pronunciation</option>
              <option value="substitution" className="bg-stone-900 text-white">Scenario B: Substitution (/k/ → /t/)</option>
              <option value="omission" className="bg-stone-900 text-white">Scenario C: Omission (sound dropped)</option>
              <option value="distortion" className="bg-stone-900 text-white">Scenario D: Atypical Distortion (low GOP)</option>
            </select>
          </div>
        </div>

        {/* Word Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TARGET_WORDS.map((w) => {
            const isSelected = selectedWord.id === w.id;
            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWord(w);
                  setHasRecorded(false);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/40 text-white'
                    : 'bg-stone-850/60 border-stone-800 text-stone-300 hover:bg-stone-850 hover:text-white'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-bold font-sans tracking-wide text-white">
                  {w.hindi}
                </div>
                <div className="text-xs text-stone-400 mt-1">"{w.meaning}"</div>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-stone-900/80 px-2 py-0.5 rounded-full inline-block border border-stone-800">
                  Target: {w.targetPhoneme}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recording Stage & Live Pipeline Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between items-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
            <span>Microphone Check: <strong>Active (16 kHz PCM)</strong></span>
            <span className="font-mono text-emerald-400">Duration: 0{recordingSeconds}s / 03s</span>
          </div>

          <div className="my-6 space-y-4">
            <div className="text-5xl font-extrabold text-white font-sans tracking-wide">
              {selectedWord.hindi}
            </div>
            <div className="text-sm text-stone-300">
              बोलिए: <span className="text-emerald-400 font-semibold">{selectedWord.sampleAudioText}</span>
            </div>

            {/* Audio Waveform visualization during recording */}
            {isRecording ? (
              <div className="flex items-center justify-center space-x-1.5 h-12">
                {[40, 75, 100, 60, 85, 45, 95, 70, 30, 85, 60, 90, 50].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDuration: `${0.3 + (i % 4) * 0.2}s` }}
                  />
                ))}
              </div>
            ) : isAnalyzing ? (
              <div className="flex items-center justify-center space-x-2 h-12 text-xs text-emerald-400 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing 16kHz audio & forced alignment...</span>
              </div>
            ) : (
              <div className="h-12 flex items-center justify-center text-xs text-stone-500 font-mono">
                {hasRecorded ? 'Recording analyzed successfully' : 'Press button below to speak'}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-3">
              {!isRecording ? (
                <button
                  id="start-mic-recording-btn"
                  onClick={handleStartRecording}
                  disabled={isAnalyzing}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all active:scale-95 cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                  <span>{hasRecorded ? 'रिकॉर्ड करें दोबारा (Retry)' : 'बोलना शुरू करें (Speak)'}</span>
                </button>
              ) : (
                <button
                  id="stop-mic-recording-btn"
                  onClick={handleStopRecording}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-all active:scale-95 cursor-pointer animate-pulse"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>रोकें (Done)</span>
                </button>
              )}

              <button
                onClick={() => {
                  const u = new SpeechSynthesisUtterance(selectedWord.hindi);
                  u.lang = 'hi-IN';
                  window.speechSynthesis?.speak(u);
                }}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                title="Hear Native Hindi Exemplar Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Audio Retention: <strong>24h TTL</strong></span>
            <span>Zero biometrics retained</span>
          </div>
        </div>

        {/* Real-Time Pipeline Inspection Output */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Inference Microservice Response (/v1/analyze)
              </h3>
              <span className="text-xs font-mono text-stone-400">§22.13 Spec</span>
            </div>

            {hasRecorded ? (
              <div className="space-y-4">
                {/* Status Header */}
                <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400">Alignment Status:</div>
                    <div className="text-base font-bold text-white mt-0.5">{result.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-400">Acoustic Confidence:</div>
                    <div className="text-base font-bold text-emerald-400 font-mono">
                      {(result.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Phoneme Slot Breakdown */}
                <div>
                  <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                    Phonetic Sequence Alignment:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                    {selectedWord.expectedPhonemes.map((exp, idx) => {
                      const prod = result.producedPhonemes[idx] || '∅';
                      const isMatch = exp === prod;
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-center font-mono text-xs ${
                            isMatch
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          }`}
                        >
                          <div className="text-[10px] text-stone-400 uppercase font-sans">
                            Slot {idx + 1}
                          </div>
                          <div className="font-bold text-white text-sm my-1">
                            /{exp}/
                          </div>
                          <div className="text-[11px] text-stone-300">
                            Heard: <span className="font-bold">/{prod}/</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GOP Metric */}
                <div className="p-3 rounded-lg bg-stone-850 border border-stone-800 text-xs flex items-center justify-between">
                  <span className="text-stone-300">Goodness of Pronunciation (GOP):</span>
                  <span className="font-mono font-bold text-teal-400">
                    {result.gop.toFixed(2)} (Threshold: 0.60)
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-stone-500 text-xs">
                <Mic className="w-8 h-8 mb-2 opacity-40" />
                <span>Audio inference results will display here after recording.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Acoustic Loss: <strong>CTC Loss</strong></span>
            <span>Lexicon: <strong>SLP-Approved Hindi</strong></span>
          </div>
        </div>
      </div>

      {/* Role-Scaled View Switcher (§19 Dashboards) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Role-Scaled Output Experience (PR-06 & §19)
            </h3>
            <p className="text-xs text-stone-400">
              The identical analysis result is rendered with distinct psychological scaffolding depending on the authenticated viewer role.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-stone-850 p-1 rounded-xl border border-stone-800 text-xs">
            {(['child', 'parent', 'therapist'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRoleView(role)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  activeRoleView === role
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {role} View
              </button>
            ))}
          </div>
        </div>

        {/* ROLE 1: CHILD VIEW */}
        {activeRoleView === 'child' && (
          <div className="bg-gradient-to-br from-emerald-950/20 via-stone-850 to-stone-900 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-10 h-10 ${
                    star <= (hasRecorded ? result.stars : 0)
                      ? 'text-amber-400 fill-amber-400 animate-bounce'
                      : 'text-stone-700'
                  }`}
                  style={{ animationDelay: `${star * 0.15}s` }}
                />
              ))}
            </div>

            <div className="text-lg sm:text-xl font-bold text-white font-sans">
              {hasRecorded ? result.childMessage : 'तैयार? माइक बटन दबाएं और कमल बोलें!'}
            </div>

            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>ध्वनि बगीचा (Sound Garden): +20 जादुई अंक (XP) मिले! 🌱</span>
            </div>

            <p className="text-xs text-stone-400 max-w-md mx-auto">
              (बाल अनुकूल इंटरफ़ेस: कभी भी लाल रंग, "गलत" या विफलता नहीं दिखाई जाती।)
            </p>
          </div>
        )}

        {/* ROLE 2: PARENT VIEW */}
        {activeRoleView === 'parent' && (
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  अभिभावक सारांश (Parent Summary):
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  सत्र प्रगति — {selectedWord.hindi}
                </h4>
              </div>

              <button
                onClick={() => setAudioDeleted(true)}
                disabled={audioDeleted}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  audioDeleted
                    ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                    : 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/50'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{audioDeleted ? 'Audio Hard-Deleted' : 'Delete Voice Recording'}</span>
              </button>
            </div>

            <p className="text-sm text-stone-200 leading-relaxed">
              {hasRecorded
                ? result.parentMessage
                : 'बच्चे का अभ्यास सत्र अभी शुरू नहीं हुआ है।'}
            </p>

            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                सुझाई गई अगली गतिविधि (Explainable Reason, PR-06):
              </span>
              <p className="text-emerald-300 font-medium">
                {hasRecorded ? result.reason : 'दैनिक अभ्यास पूरा करने के बाद अगला सुझाव उपलब्ध होगा।'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800">
              <span>दैनिक स्क्रीन समय सीमा: <strong>15 मिनट शेष</strong></span>
              <span>संबद्ध चिकित्सक: <strong>डॉ. शर्मा (स्वीकृत)</strong></span>
            </div>
          </div>
        )}

        {/* ROLE 3: THERAPIST VIEW */}
        {activeRoleView === 'therapist' && (
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  Speech-Language Pathologist Clinical Portal:
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Phonetic Alignment & Articulation Diagnostics
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTherapistOverridden(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    therapistOverridden
                      ? 'bg-sky-600 text-white border-sky-500'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  {therapistOverridden ? '✓ Label Overridden by SLP' : 'Override AI Label'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                <div className="text-stone-400">Target Phoneme IPA:</div>
                <div className="text-white font-mono font-bold text-sm mt-0.5">[{selectedWord.expectedPhonemes.join(' · ')}]</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                <div className="text-stone-400">Word Position:</div>
                <div className="text-white font-semibold mt-0.5">Initial (/k/ in CVC structure)</div>
              </div>
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                <div className="text-stone-400">GOP Likelihood:</div>
                <div className="text-emerald-400 font-mono font-bold mt-0.5">{result.gop.toFixed(3)}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs">
              <div className="text-stone-400 mb-1">Clinical Session Note:</div>
              <input
                type="text"
                placeholder="Type clinical observation (e.g. child exhibits inconsistent tongue root elevation on velars)..."
                className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-stone-200 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800 flex items-center justify-between">
              <span>Therapist ID: <strong>TH-4920 (RCI Verified)</strong></span>
              <span>Override Audit: <strong>Stored separately from raw AI model</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
