import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Volume2,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Shield,
  Heart,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useCompanion } from '../context/CompanionContext';
import { COMPANIONS } from '../components/AnimalCompanion/animalData';
import { downsampleAndEncodePCM16, LiveAudioPlayer } from '../utils/audio';

interface TranscriptItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const VOICES = [
  { id: 'Zephyr', name: 'Zephyr', desc: 'Gentle, serene & grounding (recommended)' },
  { id: 'Kore', name: 'Kore', desc: 'Warm, nurturing & empathetic' },
  { id: 'Puck', name: 'Puck', desc: 'Uplifting, playful & cheerful' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Steady, deep & protective' },
  { id: 'Charon', name: 'Charon', desc: 'Calm, measured & thoughtful' },
];

const GROUNDING_PROMPTS = [
  "I'm feeling overwhelmed and need a grounding breath.",
  "I had a stressful day and just need someone to listen.",
  "Can you help me reframe an anxious thought?",
  "What is one small kind thing I can do for myself right now?",
];

export const VoicePage: React.FC = () => {
  const { companionType } = useCompanion();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [isListening, setIsListening] = useState(false); // User is speaking
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Ready to connect');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  // References
  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll transcript
  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, []);

  const addTranscript = useCallback((role: 'user' | 'assistant', text: string) => {
    if (!text.trim()) return;
    setTranscripts((prev) => {
      // Check if last transcript is same role and recent (append instead of duplicate)
      const last = prev[prev.length - 1];
      if (last && last.role === role && last.text.endsWith('...') === false) {
        return [...prev, {
          id: `t-${Date.now()}-${Math.random()}`,
          role,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      }
      return [
        ...prev,
        {
          id: `t-${Date.now()}-${Math.random()}`,
          role,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    });
  }, []);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // 4096 buffer size yields ~90ms chunks at 44.1/48kHz
      const scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptNodeRef.current = scriptNode;

      scriptNode.onaudioprocess = (e) => {
        if (isMuted || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        // Compute instant volume level for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const level = Math.min(1, rms * 5);
        setAudioLevel(level);
        setIsListening(level > 0.08);

        // Downsample to 16kHz 16-bit PCM and encode base64
        const base64PCM16 = downsampleAndEncodePCM16(inputData, audioCtx.sampleRate, 16000);
        if (base64PCM16) {
          wsRef.current.send(
            JSON.stringify({
              audio: base64PCM16,
            })
          );
        }
      };

      source.connect(scriptNode);
      scriptNode.connect(audioCtx.destination);
    } catch (err: any) {
      console.warn('Microphone access denied or unavailable:', err);
      setErrorMessage(
        'Microphone permission is required for voice conversation. Please allow microphone access or use text input below.'
      );
    }
  };

  const stopMicrophone = () => {
    if (scriptNodeRef.current) {
      try {
        scriptNodeRef.current.disconnect();
      } catch {}
      scriptNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
    setIsListening(false);
  };

  const connectSession = async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    setErrorMessage(null);
    setStatusText('Connecting to Gemini Live API...');

    // Initialize player
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new LiveAudioPlayer((playing) => {
        setIsSpeaking(playing);
      });
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/live-ws?voice=${encodeURIComponent(
        selectedVoice
      )}&companion=${encodeURIComponent(companion.name)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        setIsConnecting(false);
        setStatusText('Connected to Live API (gemini-3.1-flash-live-preview)');
        await startMicrophone();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'audio' && data.audio) {
            audioPlayerRef.current?.playChunk(data.audio);
          } else if (data.type === 'transcript') {
            addTranscript(data.role || 'assistant', data.text);
          } else if (data.type === 'interrupted') {
            audioPlayerRef.current?.interrupt();
            setIsSpeaking(false);
          } else if (data.type === 'status') {
            setStatusText(data.message || 'Live session active');
          } else if (data.type === 'error') {
            setErrorMessage(data.error);
            disconnectSession();
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.warn('Live API WebSocket error:', err);
        setErrorMessage(
          'Live connection error. Please ensure your GEMINI_API_KEY is configured in AI Studio Settings > Secrets.'
        );
        disconnectSession();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setStatusText('Disconnected');
        stopMicrophone();
      };
    } catch (err: any) {
      console.error('Connection failed:', err);
      setErrorMessage(err?.message || 'Could not establish connection to Live API.');
      setIsConnecting(false);
    }
  };

  const disconnectSession = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    audioPlayerRef.current?.close();
    audioPlayerRef.current = null;
    stopMicrophone();
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setStatusText('Session ended');
  };

  const handleSendTextMessage = (textToSend?: string) => {
    const text = textToSend || typedMessage;
    if (!text.trim()) return;

    addTranscript('user', text.trim());
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: text.trim() }));
    } else {
      // Connect first then send
      connectSession().then(() => {
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ text: text.trim() }));
          }
        }, 800);
      });
    }

    if (!textToSend) {
      setTypedMessage('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-medium text-sm mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            <span>Real-Time Voice API</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span>Talk with {companion.name}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-medium">
              gemini-3.1-flash-live-preview
            </span>
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-xl">
            Have a natural, live voice conversation with your wellness companion. Speak freely into your microphone and hear compassionate spoken audio in real time.
          </p>
        </div>

        {/* Voice Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <Sliders className="w-4 h-4 text-slate-500 ml-1" />
          <div className="text-xs text-slate-500">Companion Voice:</div>
          <select
            id="companion-voice-select"
            value={selectedVoice}
            disabled={isConnected || isConnecting}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="text-xs font-semibold text-teal-800 bg-teal-50/70 border border-teal-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer disabled:opacity-60"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.desc.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error / Instructions Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-0.5">Live Connection Notice</p>
            <p className="text-amber-800 text-xs sm:text-sm">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-700 hover:text-amber-900 text-xs font-semibold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Center Stage: Interactive Voice Sphere & Avatar */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-teal-50/20 rounded-3xl p-8 border border-slate-200 shadow-xs mb-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Ring / Wave effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div
            className={`w-72 h-72 rounded-full border border-teal-200 transition-all duration-300 ${
              isSpeaking ? 'scale-125 border-teal-400 animate-ping opacity-25' : ''
            }`}
          />
          <div
            className={`absolute w-96 h-96 rounded-full border border-emerald-100 transition-all duration-500 ${
              isListening ? 'scale-110 border-teal-300' : ''
            }`}
          />
        </div>

        {/* Companion Avatar Card */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-5">
            {/* Animated Glow Halo */}
            <div
              className={`absolute -inset-4 rounded-full blur-xl transition-all duration-300 ${
                isSpeaking
                  ? 'bg-teal-400/40 scale-110'
                  : isListening
                  ? 'bg-emerald-400/30 scale-105'
                  : 'bg-teal-100/40'
              }`}
            />

            {/* Companion Sphere */}
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-br from-teal-50 to-emerald-100 border-4 flex items-center justify-center shadow-lg transition-all duration-200 ${
                isSpeaking
                  ? 'border-teal-500 scale-105 ring-4 ring-teal-500/20'
                  : isListening
                  ? 'border-emerald-500 scale-102 ring-4 ring-emerald-500/20'
                  : 'border-white'
              }`}
            >
              <span className="text-6xl select-none filter drop-shadow-sm animate-bounce-short">
                {companion.emoji}
              </span>
            </div>

            {/* Live indicator badge */}
            <div className="absolute bottom-1 right-1">
              <span
                className={`flex h-4 w-4 rounded-full border-2 border-white ${
                  isConnected
                    ? isSpeaking
                      ? 'bg-teal-500 ring-2 ring-teal-300'
                      : 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-1">{companion.name}</h2>
          <p className="text-xs text-slate-500 max-w-xs mb-4">
            {isSpeaking
              ? `${companion.name} is speaking...`
              : isListening
              ? 'Listening to your voice...'
              : isConnected
              ? `Connected via Live API (${selectedVoice} voice)`
              : 'Tap "Start Voice Conversation" to begin'}
          </p>

          {/* Sound wave bars when active */}
          {isConnected && (
            <div className="flex items-center justify-center gap-1 h-8 mb-6">
              {Array.from({ length: 16 }).map((_, i) => {
                const height = isSpeaking
                  ? 12 + Math.sin(i * 0.8 + Date.now() / 100) * 16 + Math.random() * 8
                  : isListening
                  ? 8 + audioLevel * 24 * Math.random()
                  : 4;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isSpeaking ? 'bg-teal-500' : isListening ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    style={{ height: `${Math.max(4, Math.min(32, height))}px` }}
                  />
                );
              })}
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex items-center gap-4">
            {!isConnected ? (
              <button
                id="start-voice-call-btn"
                onClick={connectSession}
                disabled={isConnecting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting Live...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5" />
                    <span>Start Voice Conversation</span>
                  </>
                )}
              </button>
            ) : (
              <>
                {/* Mute Mic toggle */}
                <button
                  id="mute-mic-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* End call */}
                <button
                  id="end-voice-call-btn"
                  onClick={disconnectSession}
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Conversation</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Real-Time Live Transcript & Quick Grounding Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Conversation Transcript */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Real-Time Transcript</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {statusText}
            </span>
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <Mic className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">
                  {isConnected
                    ? 'Start speaking into your mic, or select a grounding prompt below.'
                    : 'Transcript will appear here in real-time as you converse.'}
                </p>
              </div>
            ) : (
              transcripts.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col ${
                    item.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5 px-1">
                    <span>{item.role === 'user' ? 'You' : companion.name}</span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      item.role === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptsEndRef} />
          </div>

          {/* Optional Typed Input into Live Session */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              id="typed-voice-message-input"
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendTextMessage();
              }}
              placeholder={
                isConnected
                  ? 'Or type a prompt into the live voice session...'
                  : 'Type a message to start live session...'
              }
              className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              id="send-typed-voice-btn"
              onClick={() => handleSendTextMessage()}
              disabled={!typedMessage.trim()}
              className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Grounding Prompts & Safety Notice */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Grounding Starters</span>
            </h4>
            <div className="space-y-2">
              {GROUNDING_PROMPTS.map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSendTextMessage(promptText)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/50 text-xs text-slate-700 transition-all leading-relaxed"
                >
                  "{promptText}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Voice Privacy & Safety</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Voice streams are processed in real-time by Google Gemini Live API. MindMate is an emotional companion, not emergency healthcare. If in distress, call or text <strong>988</strong> anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
