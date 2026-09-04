import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCompanion } from '../context/CompanionContext';
import { AnimalCompanion } from '../components/AnimalCompanion/AnimalCompanion';
import { COMPANIONS, STATE_CONFIGS } from '../components/AnimalCompanion/animalData';
import { MoodEntry, MoodType, MOOD_DEFINITIONS } from '../types';
import {
  SmilePlus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Filter,
  Info,
  Wind,
} from 'lucide-react';

export const MoodPage: React.FC = () => {
  const { companionType, openBreathingExercise } = useCompanion();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [intensity, setIntensity] = useState<number>(6);
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter State
  const [filterMood, setFilterMood] = useState<string>('all');

  const moodList: MoodType[] = ['happy', 'calm', 'okay', 'sad', 'anxious', 'stressed', 'lonely', 'angry'];

  const loadMoods = async () => {
    try {
      const data = await api.getMoods();
      setMoods(data.moods || []);
    } catch (err) {
      console.error('Failed to load mood entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoods();
  }, []);

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await api.createMood({
        mood: selectedMood,
        intensity,
        note: note.trim() || undefined,
      });
      setMoods((prev) => [res.mood, ...prev]);
      setNote('');
      setSuccessMsg('Mood recorded successfully.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Save mood error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Delete this mood entry from your journal?')) return;
    try {
      await api.deleteMood(id);
      setMoods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete mood error:', err);
    }
  };

  // Group entries by date
  const formatDateGroup = (isoString: string): string => {
    const d = new Date(isoString);
    const now = new Date();

    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) return 'Today';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Yesterday';

    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredMoods = moods.filter((m) => {
    if (filterMood === 'all') return true;
    return m.mood === filterMood;
  });

  // Calculate statistics
  const averageIntensity =
    moods.length > 0
      ? (moods.reduce((acc, m) => acc + m.intensity, 0) / moods.length).toFixed(1)
      : '0.0';

  return (
    <div id="mood-page-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-1 mb-1">
          <SmilePlus className="w-3.5 h-3.5" />
          Emotional Check-In
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daily Mood Check-In & Journal
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          A judgment-free space to observe how you feel throughout your days.
        </p>
      </div>

      {/* Non-clinical awareness notice */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p>
          <strong>Self-reflection note:</strong> Tracking your feelings helps build everyday emotional awareness. MindMate never diagnoses depression, anxiety, or medical conditions based on your check-in ratings.
        </p>
      </div>

      {/* Check-In Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Record Today's Check-In</h2>

        {successMsg && (
          <div className="mb-5 p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-teal-900 animate-in fade-in">
            <div className="w-16 h-16 shrink-0">
              <AnimalCompanion
                type={companionType}
                state="success"
                size="sm"
                interactive={false}
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-teal-900">
                Saved. Thanks for checking in with yourself today.
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                {successMsg}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveEntry} className="space-y-6">
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Mood
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {moodList.map((m) => {
                const meta = MOOD_DEFINITIONS[m];
                const active = selectedMood === m;
                return (
                  <button
                    key={m}
                    id={`mood-select-${m}`}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      active
                        ? `${meta.bg} ${meta.border} ring-2 ring-teal-600/30 font-semibold shadow-2xs`
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className="text-sm font-medium text-slate-900">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotion-specific Companion Response */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="shrink-0">
              <AnimalCompanion
                type={companionType}
                state={selectedMood}
                size="md"
                showSpeechBubble={false}
                interactive={true}
              />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
                {companion.name}'s Reaction
              </span>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {STATE_CONFIGS[selectedMood]?.message || "I'm right here with you."}
              </p>
              {(selectedMood === 'anxious' || selectedMood === 'stressed') && (
                <button
                  type="button"
                  id="mood-page-start-breathing-btn"
                  onClick={openBreathingExercise}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Start Breathing with {companion.name}</span>
                </button>
              )}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="mood-page-intensity-slider" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                How strong is this feeling?
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md">
                  Intensity: {intensity}/10
                </span>
              </div>
            </div>
            <input
              id="mood-page-intensity-slider"
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1 mt-1">
              <span>1 (Mild / subtle)</span>
              <span>5 (Moderate)</span>
              <span>10 (Overpowering)</span>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="mood-page-note-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Want to write something about today? <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <textarea
              id="mood-page-note-input"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Had a difficult day at work, but stepped outside for 10 minutes to feel the sun..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end">
            <button
              id="save-mood-page-btn"
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Check-In'}
            </button>
          </div>
        </form>
      </div>

      {/* Mood History Section */}
      <div className="space-y-4">
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Reflection Journal</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {moods.length} total entries · Average intensity: {averageIntensity}/10
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-mood-select"
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Emotions</option>
              {moodList.map((m) => (
                <option key={m} value={m} className="capitalize">
                  {MOOD_DEFINITIONS[m].emoji} {MOOD_DEFINITIONS[m].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Entries List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your entries...</div>
        ) : filteredMoods.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No mood entries yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              How are you feeling today? Use the check-in form above to capture your first reflection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMoods.map((entry) => {
              const meta = MOOD_DEFINITIONS[entry.mood];
              const dateTag = formatDateGroup(entry.created_at);
              const exactTime = new Date(entry.created_at).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  id={`mood-entry-${entry.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                        {meta.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-teal-600" />
                            {dateTag}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">{exactTime}</span>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 capitalize">{meta.label}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                            Intensity: {entry.intensity}/10
                          </span>
                        </div>

                        {entry.note ? (
                          <p className="mt-2.5 text-sm text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                            "{entry.note}"
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-400 italic">No notes added.</p>
                        )}
                      </div>
                    </div>

                    <button
                      id={`delete-mood-btn-${entry.id}`}
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete entry"
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
    </div>
  );
};
