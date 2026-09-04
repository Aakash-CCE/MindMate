import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Download,
  Trash2,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Headphones,
  FileText,
  ListMusic,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { MusicTrack } from '../types';

interface PresetPrompt {
  id: string;
  title: string;
  mood: string;
  icon: string;
  prompt: string;
  preferredModel: 'clip' | 'pro';
}

const PRESETS: PresetPrompt[] = [
  {
    id: 'forest',
    title: 'Forest Sanctuary',
    mood: 'peaceful',
    icon: '🌿',
    prompt: 'Calm acoustic guitar and gentle Japanese shakuhachi flute, accompanied by distant soft rain and calming forest wind.',
    preferredModel: 'clip',
  },
  {
    id: 'ocean',
    title: 'Ocean Slumber',
    mood: 'sleep',
    icon: '🌊',
    prompt: 'Soothing delta-wave synthesizer pads layered with gentle rolling ocean waves, warm analog bass, and slow breathing tempo.',
    preferredModel: 'pro',
  },
  {
    id: 'anxiety',
    title: 'Anxiety Release 432Hz',
    mood: 'grounding',
    icon: '✨',
    prompt: 'Gentle harp arpeggios in 432Hz harmonic tuning, warm string drones, and soft ambient chimes for nervous system relaxation.',
    preferredModel: 'clip',
  },
  {
    id: 'lofi',
    title: 'Mellow Hearth Lo-Fi',
    mood: 'calm',
    icon: '☕',
    prompt: 'Warm lo-fi chillhop piano with vinyl warmth, subtle acoustic guitar strums, and a gentle unhurried rhythm.',
    preferredModel: 'pro',
  },
  {
    id: 'sunrise',
    title: 'Morning Serenity',
    mood: 'uplifting',
    icon: '☀️',
    prompt: 'Warm marimba, acoustic folk melody, soft morning birds, and an uplifting hopeful tone to start the day with clarity.',
    preferredModel: 'clip',
  },
  {
    id: 'zen',
    title: 'Tibetan Zen Temple',
    mood: 'meditation',
    icon: '🪷',
    prompt: 'Deep resonant Tibetan singing bowls, subtle bamboo wind chimes, and a low grounding harmonic drone.',
    preferredModel: 'clip',
  },
];

export const MusicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');
  const [modelType, setModelType] = useState<'clip' | 'pro'>('clip');
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [title, setTitle] = useState(PRESETS[0].title);
  const [selectedMood, setSelectedMood] = useState('peaceful');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Library & Currently Playing
  const [savedTracks, setSavedTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load tracks on mount
  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const res = await api.getMusicTracks();
      setSavedTracks(res.tracks || []);
      if (!currentTrack && res.tracks && res.tracks.length > 0) {
        setCurrentTrack(res.tracks[0]);
      }
    } catch (err) {
      console.warn('Could not load user tracks:', err);
    }
  };

  // Synchronize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooping]);

  // Handle currentTrack source change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const src = currentTrack.audio_base64
        ? `data:${currentTrack.mime_type || 'audio/wav'};base64,${currentTrack.audio_base64}`
        : currentTrack.audio_url || '';
      if (src) {
        audioRef.current.src = src;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.loop = isLooping;
        if (isPlaying) {
          audioRef.current.play().catch(console.warn);
        }
      }
    }
  }, [currentTrack]);

  // Volume & Mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setNotice(null);

    try {
      const res = await api.generateMusic({
        prompt: prompt.trim(),
        modelType,
        mood: selectedMood,
        title: title.trim() || `${selectedMood} Soundscape`,
        saveToLibrary: true,
      });

      if (res.track) {
        setCurrentTrack(res.track);
        setIsPlaying(true);
        if (audioRef.current) {
          const src = `data:${res.track.mime_type || 'audio/wav'};base64,${res.track.audio_base64}`;
          audioRef.current.src = src;
          audioRef.current.play().catch(console.warn);
        }
        await loadTracks();
      }

      if (res.message) {
        setNotice(res.message);
      }
    } catch (err: any) {
      setNotice(err?.message || 'Failed to generate track. Please verify your GEMINI_API_KEY in Settings > Secrets.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteTrack = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteMusicTrack(id);
      if (currentTrack?.id === id) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTrack(null);
      }
      setSavedTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.warn('Failed to delete track:', err);
    }
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setTitle(preset.title);
    setSelectedMood(preset.mood);
    setModelType(preset.preferredModel);
  };

  const downloadTrack = () => {
    if (!currentTrack || !currentTrack.audio_base64) return;
    const link = document.createElement('a');
    link.href = `data:${currentTrack.mime_type || 'audio/wav'};base64,${currentTrack.audio_base64}`;
    link.download = `${currentTrack.title.replace(/\s+/g, '_').toLowerCase()}.wav`;
    link.click();
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-medium text-sm mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>AI Acoustic Therapy Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span>Calm Music Studio</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-medium">
              Lyria Models
            </span>
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Generate custom therapeutic soundscapes and relaxing ambient tracks using Google's <strong>lyria-3-clip-preview</strong> (up to 30s) and <strong>lyria-3-pro-preview</strong> (full tracks) to restore calm.
          </p>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start">
          <button
            id="tab-create-music"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'create'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Generate</span>
          </button>
          <button
            id="tab-library-music"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'library'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span>Saved Tracks ({savedTracks.length})</span>
          </button>
        </div>
      </div>

      {/* Notice Banner if any */}
      {notice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-0.5">Lyria Music Status</p>
            <p className="text-amber-800">{notice}</p>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-amber-700 hover:text-amber-900 text-xs font-semibold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator or Library */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'create' ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>Compose Ambient Soundscape</span>
                </span>
                <span className="text-xs font-normal text-slate-500">
                  Select model & prompt
                </span>
              </h2>

              {/* Model Selector Toggle (Lyria Clip vs Lyria Pro) */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Lyria Generation Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="model-clip-btn"
                    onClick={() => setModelType('clip')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      modelType === 'clip'
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-800">lyria-3-clip-preview</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-medium">
                        30s Clip
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Fast focused audio clips for immediate grounding, breathing cycles, or quick stress relief.
                    </p>
                  </button>

                  <button
                    type="button"
                    id="model-pro-btn"
                    onClick={() => setModelType('pro')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      modelType === 'pro'
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-800">lyria-3-pro-preview</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                        Full Track
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Full-length immersive ambient soundtracks with evolving harmonic textures for deep meditation & sleep.
                    </p>
                  </button>
                </div>
              </div>

              {/* Therapeutic Preset Cards */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Therapeutic Sound Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESETS.map((p) => {
                    const isSelected = title === p.title;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 text-teal-900 font-semibold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        <span className="text-xs font-semibold line-clamp-1">{p.title}</span>
                        <span className="text-[11px] text-slate-500 capitalize">{p.mood}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Track Title
                  </label>
                  <input
                    id="music-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Deep Forest Breathing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Sound Prompt Description
                  </label>
                  <textarea
                    id="music-prompt-input"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe instruments, tempo, acoustic environment, and emotional feeling..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Target length: {modelType === 'clip' ? '30 seconds' : '120 seconds'}</span>
                  </div>

                  <button
                    id="generate-music-btn"
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium text-sm shadow-sm hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Composing with Lyria...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Track</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Saved Tracks Library */
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-teal-600" />
                  <span>Your Relaxation Library</span>
                </span>
                <span className="text-xs text-slate-500">{savedTracks.length} tracks</span>
              </h2>

              {savedTracks.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl">
                  <Headphones className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">No tracks saved yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Create your first calming audio track with Lyria in the Generate tab!
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg hover:bg-teal-100 transition-all cursor-pointer"
                  >
                    Create a Track
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {savedTracks.map((track) => {
                    const isSelected = currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          setCurrentTrack(track);
                          setIsPlaying(true);
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                              isSelected && isPlaying
                                ? 'bg-teal-600 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-700 hover:bg-teal-600 hover:text-white'
                            }`}
                          >
                            {isSelected && isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-slate-800 truncate">
                              {track.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="truncate max-w-[160px]">{track.prompt}</span>
                              <span>•</span>
                              <span>{track.duration_seconds}s</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] uppercase text-teal-700 bg-teal-50 px-1 rounded">
                                {track.model.includes('pro') ? 'Pro' : 'Clip'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title="Delete track"
                            onClick={(e) => handleDeleteTrack(track.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Player & Lyrics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Audio Player Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  Now Playing
                </span>
              </div>
              {currentTrack && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 font-mono">
                  {currentTrack.model}
                </span>
              )}
            </div>

            {currentTrack ? (
              <div>
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-slate-300 mb-6 line-clamp-2">
                  {currentTrack.prompt}
                </p>

                {/* Animated Waveform Visualizer */}
                <div className="h-16 flex items-end justify-between gap-1 mb-6 px-1 bg-slate-950/40 rounded-xl p-3 border border-slate-700/40">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const progress = duration > 0 ? currentTime / duration : 0;
                    const barPos = i / 28;
                    const isPlayed = barPos <= progress;
                    // Dynamic height
                    const h = isPlaying
                      ? 20 + Math.sin(i * 0.7 + currentTime * 4) * 18 + Math.random() * 12
                      : 12;
                    return (
                      <div
                        key={i}
                        className={`w-full rounded-full transition-all duration-150 ${
                          isPlayed ? 'bg-teal-400' : 'bg-slate-700'
                        }`}
                        style={{ height: `${Math.max(6, Math.min(48, h))}px` }}
                      />
                    );
                  })}
                </div>

                {/* Scrubber */}
                <div className="space-y-1.5 mb-5">
                  <input
                    id="audio-scrubber"
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    title={isLooping ? 'Disable repeat' : 'Repeat track'}
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-2 rounded-lg transition-colors ${
                      isLooping ? 'text-teal-400 bg-teal-950/60' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      id="play-pause-track-btn"
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      title="Download audio file"
                      onClick={downloadTrack}
                      className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      title={isMuted ? 'Unmute' : 'Mute'}
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Music className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">Ready to play</p>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a preset on the left or tap Generate to listen.
                </p>
              </div>
            )}
          </div>

          {/* Lyrics / Companion Meditation Insight */}
          {currentTrack?.lyrics && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Lyria Generated Lyrics & Reflection</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 italic whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                "{currentTrack.lyrics}"
              </p>
            </div>
          )}

          {/* Model Information Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>About Lyria Music Generation</span>
            </h4>
            <p>
              • <strong>lyria-3-clip-preview</strong> produces up to 30-second therapeutic clips for immediate sensory soothing.
            </p>
            <p>
              • <strong>lyria-3-pro-preview</strong> generates extended soundscapes suitable for guided meditation, deep work, or drifting off to sleep.
            </p>
            <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
              Configured via Google AI Studio's Generative AI SDK with audio modality streaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
