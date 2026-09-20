import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MainNavView } from '../navigation/Navbar';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  Command, 
  X, 
  Check, 
  Volume2, 
  Compass, 
  Bot, 
  Home, 
  BookOpen, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface GlobalVoiceCommanderProps {
  currentView: MainNavView;
  setCurrentView: (view: MainNavView) => void;
}

interface CommandMatch {
  action: 'navigate' | 'mitri_send' | 'mitri_reset' | 'mitri_stop' | 'toggle_mic';
  view?: MainNavView;
  message?: string;
  feedback: string;
}

export const GlobalVoiceCommander: React.FC<GlobalVoiceCommanderProps> = ({
  currentView,
  setCurrentView
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  isListeningRef.current = isListening;

  // Speak short confirmation audio feedback
  const speakConfirmation = useCallback((text: string) => {
    if (!audioFeedback || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }, [audioFeedback, speechLang]);

  // Command parser for natural language navigation & Mitri control
  const parseVoiceCommand = useCallback((rawText: string): CommandMatch | null => {
    const text = rawText.toLowerCase().trim();

    // 1. Mitri Voice Buddy controls & conversation triggers
    if (
      text.includes('stop voice') || 
      text.includes('आवाज़ बंद') || 
      text.includes('चुप') || 
      text.includes('stop talking') ||
      text.includes('ruk jao') ||
      text.includes('रुको')
    ) {
      return {
        action: 'mitri_stop',
        feedback: 'Stopping Mitri voice output'
      };
    }

    if (
      text.includes('reset chat') || 
      text.includes('नया चैट') || 
      text.includes('start over') || 
      text.includes('restart mitri')
    ) {
      return {
        action: 'mitri_reset',
        feedback: 'Resetting Mitri conversation'
      };
    }

    // Direct speech to Mitri (e.g., "Mitri tell me a story", "मित्री नमस्ते", "ask mitri ...")
    const mitriTriggers = ['mitri', 'मित्री', 'hey mitri', 'bolo mitri', 'ask mitri'];
    for (const trigger of mitriTriggers) {
      if (text.startsWith(trigger)) {
        const query = rawText.substring(trigger.length).trim();
        return {
          action: 'mitri_send',
          message: query || 'नमस्ते मित्री!',
          feedback: `Talking to Mitri: "${query || 'नमस्ते'}"`
        };
      }
    }

    // 2. Natural Language Navigation Routing
    // Home
    if (
      text.includes('home') || 
      text.includes('होम') || 
      text.includes('main page') || 
      text.includes('घर') || 
      text.includes('shuruat')
    ) {
      return {
        action: 'navigate',
        view: 'home',
        feedback: 'Navigating to Home'
      };
    }

    // Sound Garden
    if (
      text.includes('sound garden') || 
      text.includes('साउंड गार्डन') || 
      text.includes('garden') || 
      text.includes('बगीचा') || 
      text.includes('flora') || 
      text.includes('plants')
    ) {
      return {
        action: 'navigate',
        view: 'child_dashboard',
        feedback: 'Opening Sound Garden'
      };
    }

    // Practice Arena
    if (
      text.includes('practice') || 
      text.includes('प्रैक्टिस') || 
      text.includes('arena') || 
      text.includes('अभ्यास') || 
      text.includes('mic arena') || 
      text.includes('sound practice')
    ) {
      return {
        action: 'navigate',
        view: 'practice_arena',
        feedback: 'Opening Practice Arena'
      };
    }

    // Mitri AI Buddy View
    if (
      text.includes('ai buddy') || 
      text.includes('talk to mitri') || 
      text.includes('mitri buddy') || 
      text.includes('chat buddy') || 
      text.includes('मित्र') || 
      text.includes('open mitri') ||
      text.includes('बातचीत')
    ) {
      return {
        action: 'navigate',
        view: 'ai_conversation',
        feedback: 'Opening Mitri AI Buddy'
      };
    }

    // Curriculum / Courses
    if (
      text.includes('curriculum') || 
      text.includes('course') || 
      text.includes('पाठ्यक्रम') || 
      text.includes('पाठ') || 
      text.includes('lessons') || 
      text.includes('syllabus')
    ) {
      return {
        action: 'navigate',
        view: 'courses',
        feedback: 'Opening Curriculum'
      };
    }

    // Assessment
    if (
      text.includes('assessment') || 
      text.includes('मूल्यांकन') || 
      text.includes('test') || 
      text.includes('परीक्षण') || 
      text.includes('phonetic test')
    ) {
      return {
        action: 'navigate',
        view: 'assessment',
        feedback: 'Opening Phonetic Assessment'
      };
    }

    // Analytics
    if (
      text.includes('analytics') || 
      text.includes('progress') || 
      text.includes('प्रगति') || 
      text.includes('speech twin') || 
      text.includes('stats')
    ) {
      return {
        action: 'navigate',
        view: 'analytics',
        feedback: 'Opening Progress Analytics'
      };
    }

    // Parent Portal
    if (
      text.includes('parent') || 
      text.includes('माता पिता') || 
      text.includes('parent portal') || 
      text.includes('family')
    ) {
      return {
        action: 'navigate',
        view: 'parent_portal',
        feedback: 'Opening Parent Portal'
      };
    }

    // Therapist / SLP Portal
    if (
      text.includes('therapist') || 
      text.includes('doctor') || 
      text.includes('slp') || 
      text.includes('caseload') || 
      text.includes('क्लिनिक')
    ) {
      return {
        action: 'navigate',
        view: 'therapist_portal',
        feedback: 'Opening Therapist Portal'
      };
    }

    // Community
    if (
      text.includes('community') || 
      text.includes('forum') || 
      text.includes('समुदाय')
    ) {
      return {
        action: 'navigate',
        view: 'community',
        feedback: 'Opening Community Forum'
      };
    }

    // PRD Specs
    if (
      text.includes('prd') || 
      text.includes('specs') || 
      text.includes('specification')
    ) {
      return {
        action: 'navigate',
        view: 'prd_specs',
        feedback: 'Opening PRD Specifications'
      };
    }

    // If currently on AI Conversation View, send any spoken sentence as a prompt to Mitri
    if (currentView === 'ai_conversation' && rawText.trim().length > 1) {
      return {
        action: 'mitri_send',
        message: rawText,
        feedback: `Sending to Mitri: "${rawText}"`
      };
    }

    return null;
  }, [currentView]);

  // Execute recognized command
  const executeCommand = useCallback((cmd: CommandMatch) => {
    setLastExecutedCommand(cmd.feedback);
    speakConfirmation(cmd.feedback);

    if (cmd.action === 'navigate' && cmd.view) {
      setCurrentView(cmd.view);
    } else if (cmd.action === 'mitri_send' && cmd.message) {
      // If not on AI Conversation view, navigate there first
      if (currentView !== 'ai_conversation') {
        setCurrentView('ai_conversation');
      }
      // Dispatch custom DOM event to AIConversationView
      window.dispatchEvent(new CustomEvent('mitri-voice-command-send', {
        detail: { message: cmd.message }
      }));
    } else if (cmd.action === 'mitri_stop') {
      window.dispatchEvent(new CustomEvent('mitri-voice-command-stop'));
    } else if (cmd.action === 'mitri_reset') {
      if (currentView !== 'ai_conversation') {
        setCurrentView('ai_conversation');
      }
      window.dispatchEvent(new CustomEvent('mitri-voice-command-reset'));
    }

    // Clear confirmation after 4 seconds
    setTimeout(() => {
      setLastExecutedCommand(null);
    }, 4000);
  }, [currentView, setCurrentView, speakConfirmation]);

  // Setup Web Speech API Recognition
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLang;

    recognition.onstart = () => {
      setIsListening(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const activeText = final || interim;
      setTranscript(activeText);

      if (final) {
        const cmd = parseVoiceCommand(final);
        if (cmd) {
          executeCommand(cmd);
          setTranscript('');
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setMicError('Microphone permission denied. Enable mic in browser settings.');
        setIsListening(false);
      } else if (event.error !== 'no-speech') {
        console.warn('Voice command recognizer notice:', event.error);
      }
    };

    recognition.onend = () => {
      // If user wanted active listening, keep it alive safely
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [speechLang, parseVoiceCommand, executeCommand]);

  const toggleGlobalListening = async () => {
    if (isListening) {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setTranscript('');
    } else {
      setMicError(null);
      // Prompt user media if necessary to ensure browser level permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Release test stream tracks immediately so recognition has full device control
          stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
          console.warn('getUserMedia notice:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setMicError('Microphone permission blocked. Please allow mic in browser address bar.');
            return;
          }
        }
      }

      isListeningRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = speechLang;
          recognitionRef.current.start();
          setIsListening(true);
          setMicError(null);
        } catch (e) {
          try {
            recognitionRef.current.abort();
            setTimeout(() => {
              recognitionRef.current?.start();
              setIsListening(true);
            }, 150);
          } catch (err) {
            setMicError('Could not start voice listener. Please tap the button again.');
          }
        }
      }
    }
  };

  if (!speechSupported) return null;

  return (
    <>
      {/* Floating Global Voice Commander Hub */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end space-y-2 pointer-events-auto">
        
        {/* Real-time speech transcript & execution bubble */}
        {(transcript || lastExecutedCommand || micError) && (
          <div className="max-w-xs sm:max-w-sm p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl animate-fadeIn text-xs space-y-1">
            {micError ? (
              <div className="text-rose-600 font-bold flex items-center space-x-1">
                <span>⚠️</span>
                <span>{micError}</span>
              </div>
            ) : lastExecutedCommand ? (
              <div className="text-emerald-700 font-black flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{lastExecutedCommand}</span>
              </div>
            ) : (
              <div className="text-slate-700 font-medium flex items-center space-x-1.5">
                <Radio className="w-3 h-3 text-emerald-600 animate-spin shrink-0" />
                <span className="italic truncate">"{transcript}"</span>
              </div>
            )}
          </div>
        )}

        {/* Global Voice Commander Main Control Pill */}
        <div className="flex items-center space-x-1.5 bg-slate-900/95 text-white p-1.5 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md">
          
          {/* Main Push-to-Listen Voice Button */}
          <button
            onClick={toggleGlobalListening}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
            }`}
            title={isListening ? 'Click to pause Global Voice Listener' : 'Click to activate Global Voice Commands'}
          >
            {isListening ? (
              <>
                <Mic className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">Voice Active</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Command</span>
              </>
            )}
          </button>

          {/* Language Toggle (Hindi / English) */}
          <button
            onClick={() => {
              const next = speechLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
              setSpeechLang(next);
              if (isListening && recognitionRef.current) {
                recognitionRef.current.abort();
              }
            }}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 transition-colors"
            title="Switch Voice Command Language"
          >
            {speechLang === 'hi-IN' ? 'हिन्दी' : 'ENG'}
          </button>

          {/* Audio Feedback Toggle */}
          <button
            onClick={() => setAudioFeedback(!audioFeedback)}
            className={`p-2 rounded-lg transition-colors ${
              audioFeedback ? 'text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={audioFeedback ? 'Voice Response Enabled' : 'Voice Response Muted'}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Command Cheat Sheet Help Button */}
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="View Spoken Commands"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spoken Voice Commands Cheat Sheet Modal */}
      {isHelpOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsHelpOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Command className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Global Voice Commands</h3>
                <p className="text-xs text-slate-500">Speak naturally in Hindi or English from anywhere in the app</p>
              </div>
            </div>

            <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Navigation Commands */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Navigation Commands (ऐप में कहीं भी जाएं):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Go Home"</span> / <span className="text-slate-700 font-semibold">"होम पर जाओ"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Open Sound Garden"</span> / <span className="text-slate-700 font-semibold">"गार्डन खोलो"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Practice Arena"</span> / <span className="text-slate-700 font-semibold">"अभ्यास शुरू करो"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Talk to Mitri"</span> / <span className="text-slate-700 font-semibold">"मित्री से बात कराओ"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Open Assessment"</span> / <span className="text-slate-700 font-semibold">"मूल्यांकन खोलो"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Curriculum"</span> / <span className="text-slate-700 font-semibold">"पाठ्यक्रम दिखाओ"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Parent Portal"</span> / <span className="text-slate-700 font-semibold">"पैरेंट पोर्टल"</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700">"Therapist Caseload"</span> / <span className="text-slate-700 font-semibold">"थेरेपिस्ट पोर्टल"</span>
                  </div>
                </div>
              </div>

              {/* Mitri AI Buddy Voice Controls */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 text-xs flex items-center space-x-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mitri AI Buddy Controls (मित्री से वॉइस बातचीत):</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 flex items-start space-x-2">
                    <span className="font-bold text-emerald-700 shrink-0">"Mitri [your message]"</span>
                    <span className="text-slate-600">उदा. <em>"मित्री मुझे तितली की कहानी सुनाओ"</em> या <em>"Mitri help me say Kamal"</em></span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">"Stop voice" / "रुको" / "चुप"</span>
                    <span className="text-slate-500 text-[11px]">Stops Mitri from speaking</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">"Reset chat" / "नया चैट"</span>
                    <span className="text-slate-500 text-[11px]">Starts fresh conversation</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsHelpOpen(false);
                if (!isListening) toggleGlobalListening();
              }}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Start Speaking Voice Commands
            </button>
          </div>
        </div>
      )}
    </>
  );
};
