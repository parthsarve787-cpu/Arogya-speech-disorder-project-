import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Square,
  Volume2, 
  VolumeX,
  RefreshCw, 
  Lightbulb,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { sendMitriChatMessage } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAudio?: boolean;
}

export const AIConversationView: React.FC = () => {
  const { currentChild } = useAuth();
  const childFirstName = currentChild.name.split(' ')[0] || 'आरव';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_1',
      sender: 'assistant',
      text: `नमस्ते ${childFirstName}! 🌟 I am Mitri (मित्री), your AI voice & speech buddy! You can speak to me using your microphone, and I will speak back to you! What word shall we practice together?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Voice Interaction States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [autoSpeakMitri, setAutoSpeakMitri] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.85);
  const [languageMode, setLanguageMode] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micStatusNotice, setMicStatusNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = languageMode;

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusNotice('Listening to your voice... Speak now!');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript('');
          setInputText(final);
          setIsListening(false);
          setMicStatusNotice(null);
          // Automatically send message when child completes speaking sentence
          handleSendMessage(final, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setMicStatusNotice('Microphone permission blocked. Please enable mic access.');
        } else if (event.error === 'no-speech') {
          setMicStatusNotice('No voice detected. Tap microphone and speak again.');
        } else {
          setMicStatusNotice('Voice input paused. You can also type below.');
        }
        setTimeout(() => setMicStatusNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization notice:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [languageMode]);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, interimTranscript]);

  // Mitri Voice output (TTS) with warm natural tone
  const speakText = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(msgId);

      // Clean markdown/emojis for clearer speech synthesis pronunciation
      const cleanedText = text
        .replace(/[*_#~]/g, '')
        .replace(/[🌟🌸🎈🦋🪷🎉✨👦👧🤖🌱]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = languageMode;
      utterance.rate = voiceSpeed;
      utterance.pitch = 1.1; // Gentle, child-friendly warmer pitch

      // Pick best available Hindi/Indian English voice if present in system
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        (languageMode === 'hi-IN' && (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('lekha') || v.name.toLowerCase().includes('neerja'))) ||
        (languageMode === 'en-IN' && (v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')))
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  };

  // Toggle Microphone recording
  const toggleListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    // Stop Mitri's current voice if she is speaking so she can listen
    stopSpeaking();

    // Check / prompt user media permission if needed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicStatusNotice('Microphone permission blocked. Please enable mic access in browser.');
          return;
        }
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = languageMode;
        recognitionRef.current.start();
        setMicStatusNotice('Listening... Speak now into the mic!');
      } catch (e) {
        console.warn('Speech recognition start error:', e);
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 200);
        } catch (err) {}
      }
    } else {
      setMicStatusNotice('Microphone not supported on this browser. You can type your message below.');
    }
  };

  // Send message and get Mitri's response
  const handleSendMessage = async (textToSend?: string, wasAudioInput: boolean = false) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    // Stop speaking and listening
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudio: wasAudioInput,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setInterimTranscript('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

      const res = await sendMitriChatMessage(history, text, childFirstName);
      const assistantMsg: Message = {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: res.reply || `बहुत अच्छे ${childFirstName}! आपकी आवाज़ सुनकर बहुत ख़ुशी हुई! 🌸`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak Mitri's response if autoSpeakMitri is on
      if (autoSpeakMitri) {
        speakText(assistantMsg.text, assistantMsg.id);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: 'ast_err_' + Date.now(),
        sender: 'assistant',
        text: `शाबाश ${childFirstName}! आपकी आवाज़ बहुत अच्छी थी! क्या हम "कमल" या "तितली" बोलना दोहराएं? 🌸`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeakMitri) {
        speakText(fallbackMsg.text, fallbackMsg.id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Connect to Global Voice Commander events
  useEffect(() => {
    const handleVoiceSend = (e: any) => {
      if (e.detail?.message) {
        handleSendMessage(e.detail.message, true);
      }
    };

    const handleVoiceStop = () => {
      stopSpeaking();
    };

    const handleVoiceReset = () => {
      stopSpeaking();
      setMessages([
        {
          id: 'm_' + Date.now(),
          sender: 'assistant',
          text: `नमस्ते ${childFirstName}! 🌟 New chat started. Tap the microphone or say "Mitri" to practice!`,
          timestamp: 'Just now',
        },
      ]);
    };

    window.addEventListener('mitri-voice-command-send', handleVoiceSend);
    window.addEventListener('mitri-voice-command-stop', handleVoiceStop);
    window.addEventListener('mitri-voice-command-reset', handleVoiceReset);

    return () => {
      window.removeEventListener('mitri-voice-command-send', handleVoiceSend);
      window.removeEventListener('mitri-voice-command-stop', handleVoiceStop);
      window.removeEventListener('mitri-voice-command-reset', handleVoiceReset);
    };
  }, [childFirstName]);

  const quickPrompts = [
    'नमस्ते मित्री! 🌸',
    'मैंने आज "कमल" का अभ्यास किया!',
    'How do I say "पानी" clearly?',
    'एक तितली की प्यारी कहानी सुनाओ! 🦋',
    'क अक्षर का उच्चारण कैसे करें?',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 animate-fadeIn">
      
      {/* Header with Mitri Voice Avatar & Audio Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Animated Mitri Avatar that pulses when she speaks */}
            <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 ${
              speakingId 
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 scale-105 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100' 
                : 'bg-gradient-to-tr from-amber-400 to-rose-400'
            }`}>
              {speakingId ? '🗣️' : '👧'}
              {speakingId && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-ping"></span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-slate-900">Mitri (मित्री) AI Voice Companion</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {speakingId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse flex items-center space-x-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Speaking...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                2-Way Real-time Voice Chat · Powered by Gemini 3.8 Flash & Speech Audio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Stop current audio speech button */}
            {speakingId && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center space-x-1 transition-colors"
                title="Stop Mitri's voice"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Voice</span>
              </button>
            )}

            {/* Conversation Reset */}
            <button
              onClick={() => {
                stopSpeaking();
                setMessages([
                  {
                    id: 'm_' + Date.now(),
                    sender: 'assistant',
                    text: `नमस्ते ${childFirstName}! 🌟 Let's start a fresh voice chat! Tap the microphone below and speak to me!`,
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors text-xs font-semibold flex items-center space-x-1"
              title="Reset Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Voice Setting Toggles Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            {/* Auto-Voice Response Toggle */}
            <button
              onClick={() => setAutoSpeakMitri(!autoSpeakMitri)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition-colors ${
                autoSpeakMitri 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Mitri Voice: {autoSpeakMitri ? 'On (बोलकर जवाब देगी)' : 'Muted'}</span>
            </button>

            {/* Language Accent Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
              <button
                onClick={() => setLanguageMode('hi-IN')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  languageMode === 'hi-IN' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => setLanguageMode('en-IN')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  languageMode === 'en-IN' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Voice Speed Control */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Speech Speed:</span>
            <button 
              onClick={() => setVoiceSpeed(prev => prev === 0.75 ? 0.85 : prev === 0.85 ? 1.0 : 0.75)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              {voiceSpeed === 0.75 ? '🐢 Slow (0.75x)' : voiceSpeed === 0.85 ? '🌟 Calm (0.85x)' : '⚡ Normal (1.0x)'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="h-[410px] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm shrink-0 shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {m.sender === 'user' ? (m.isAudio ? '🎙️' : '👦') : '👧'}
            </div>

            <div
              className={`max-w-[84%] rounded-2xl p-4 space-y-1.5 shadow-xs transition-all ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-200/80'
              }`}
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{m.text}</div>
              
              <div className="flex items-center justify-between text-[10px] opacity-80 pt-1 border-t border-black/5">
                <div className="flex items-center space-x-1.5">
                  <span>{m.timestamp}</span>
                  {m.isAudio && (
                    <span className="flex items-center space-x-0.5 text-[9px] bg-emerald-700/60 px-1.5 py-0.2 rounded text-emerald-100 font-medium">
                      <Mic className="w-2.5 h-2.5" />
                      <span>Voice Input</span>
                    </span>
                  )}
                </div>

                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakingId === m.id ? stopSpeaking() : speakText(m.text, m.id)}
                    className={`p-1 rounded-lg transition-colors flex items-center space-x-1 ${
                      speakingId === m.id 
                        ? 'bg-amber-100 text-amber-700 font-bold' 
                        : 'hover:bg-slate-200/80 text-emerald-700'
                    }`}
                    title="Tap to listen to Mitri's voice"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${speakingId === m.id ? 'animate-bounce text-amber-600' : ''}`} />
                    <span className="text-[10px]">{speakingId === m.id ? 'Playing...' : 'Play Voice'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Live speech transcription bubble while child is speaking */}
        {isListening && (
          <div className="flex items-start gap-3 flex-row-reverse animate-pulse">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-sm shrink-0 shadow-md">
              <Mic className="w-4 h-4 animate-ping" />
            </div>
            <div className="max-w-[84%] rounded-2xl p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-tr-none space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-700">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>आप बोल रहे हैं (Listening in real-time)...</span>
              </div>
              <p className="text-xs sm:text-sm font-medium italic">
                {interimTranscript || 'बोलिए, मित्री आपकी आवाज़ सुन रही है...'}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>मित्री सोच रही है और अपना जवाब तैयार कर रही है...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Real-time status / Microphone alert banner */}
      {micStatusNotice && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{micStatusNotice}</span>
          </div>
          <button onClick={() => setMicStatusNotice(null)} className="text-amber-700 hover:text-amber-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Suggested Quick Practice Prompts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Quick Prompts:</span>
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-400 text-xs font-medium shrink-0 transition-colors shadow-2xs active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Dual Voice & Text Input Bar */}
      <div className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-md focus-within:border-emerald-500 transition-colors"
        >
          {/* Prominent Real-time Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
            title={isListening ? 'Stop recording voice' : 'Tap to speak with your voice (माइक से बोलें)'}
          >
            {isListening ? (
              <Square className="w-4 h-4 fill-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Text Input with auto-transcription support */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to your voice... (बोलिए...)' : 'माइक दबाकर बोलें या यहाँ लिखें (e.g. नमस्ते मित्री)...'}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-sm transition-all"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Child & Parent Guidance Tip */}
        <div className="flex items-center justify-between px-3 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {isListening 
                ? '🎙️ माइक चालू है: साफ़ आवाज़ में बोलिए, मित्री सुनकर जवाब देगी।' 
                : '💡 माइक बटन दबाकर बोलें या टाइप करें। मित्री अपनी आवाज़ में उत्तर देगी।'}
            </span>
          </div>

          <span className="text-[10px] text-emerald-700 font-semibold hidden sm:inline">
            Speech-to-Text & Text-to-Speech Active
          </span>
        </div>
      </div>

    </div>
  );
};
