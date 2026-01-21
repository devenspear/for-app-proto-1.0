import React, { useState, useEffect } from 'react';
import { CheckCircle, Flame, Calendar, BookOpen } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { useDataStore } from '../store/useDataStore';
import { CharacterTheme, DailyCheckIn as CheckInType } from '../types';
import { THEME_DEFINITIONS, getThemeLightBg } from '../constants/themes';
import { getToday, formatDate } from '../utils/dates';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Very Low' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😕', label: 'Down' },
  { value: 4, emoji: '😐', label: 'Neutral' },
  { value: 5, emoji: '🙂', label: 'Okay' },
  { value: 6, emoji: '😊', label: 'Good' },
  { value: 7, emoji: '😀', label: 'Great' },
  { value: 8, emoji: '😁', label: 'Very Good' },
  { value: 9, emoji: '🤩', label: 'Excellent' },
  { value: 10, emoji: '✨', label: 'Amazing' },
];

export const DailyCheckIn: React.FC = () => {
  const {
    todaysCheckIn,
    checkInStreak,
    saveCheckIn,
    loadTodaysData,
    calculateStreak,
    isLoading,
  } = useDataStore();

  const [moodScore, setMoodScore] = useState(5);
  const [primaryTheme, setPrimaryTheme] = useState<CharacterTheme | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadTodaysData();
    calculateStreak();
  }, []);

  useEffect(() => {
    if (todaysCheckIn) {
      setMoodScore(todaysCheckIn.moodScore);
      setPrimaryTheme(todaysCheckIn.primaryTheme);
      setJournalEntry(todaysCheckIn.journalEntry || '');
    }
  }, [todaysCheckIn]);

  const handleSave = async () => {
    if (!primaryTheme) return;

    const checkIn: CheckInType = {
      date: getToday(),
      moodScore,
      primaryTheme,
      journalEntry: journalEntry.trim() || undefined,
      createdAt: Date.now(),
    };

    await saveCheckIn(checkIn);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isComplete = todaysCheckIn !== null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Daily Check-In</h1>
            <p className="text-neutral-500 flex items-center gap-2 mt-1">
              <Calendar size={16} />
              {formatDate(getToday())}
            </p>
          </div>
          {checkInStreak.currentStreak > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl shadow-soft">
              <Flame size={18} />
              <span className="font-bold">{checkInStreak.currentStreak}</span>
              <span className="text-orange-100 text-sm">day{checkInStreak.currentStreak !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Already completed indicator */}
        {isComplete && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">You've already checked in today. You can update your entry below.</span>
          </div>
        )}

        {/* Mood Selector */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">How are you feeling today?</h2>
          </div>
          <div className="p-5">
            <div className="flex justify-between gap-1">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMoodScore(option.value)}
                  className={`
                    flex-1 py-3 rounded-xl transition-all duration-150
                    flex flex-col items-center gap-1
                    ${moodScore === option.value
                      ? 'bg-primary-100 scale-110 shadow-soft'
                      : 'hover:bg-neutral-50'
                    }
                  `}
                >
                  <span className="text-2xl">{option.emoji}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-3 px-2">
              <span>Struggling</span>
              <span>Thriving</span>
            </div>
            <p className="text-center mt-4">
              <span className="text-3xl font-bold text-primary-600">{moodScore}</span>
              <span className="text-neutral-400 text-lg">/10</span>
              <span className="block text-sm text-neutral-500 mt-1">
                {MOOD_OPTIONS.find(o => o.value === moodScore)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* Theme Picker */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Which theme showed up most today?</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Select the character pattern that was most present
            </p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {Object.values(CharacterTheme).map((theme) => {
                const def = THEME_DEFINITIONS[theme];
                const isSelected = primaryTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => setPrimaryTheme(theme)}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-150 text-center
                      ${isSelected
                        ? 'border-primary-500 shadow-soft scale-[1.02]'
                        : 'border-transparent hover:border-neutral-200'
                      }
                    `}
                    style={{
                      backgroundColor: isSelected ? getThemeLightBg(theme) : '#f9fafb',
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: def.color }}
                    />
                    <span className={`text-xs font-medium ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                      {def.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <BookOpen size={18} className="text-neutral-400" />
              Journal
              <span className="text-xs font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Optional</span>
            </h2>
          </div>
          <div className="p-5">
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Any thoughts, reflections, or observations from today..."
              rows={4}
              className="
                w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl
                text-neutral-900 placeholder-neutral-400
                focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                transition-all duration-150
              "
            />
            <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Your journal is stored locally and never shared
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!primaryTheme}
          isLoading={isLoading}
          size="lg"
          className="w-full"
        >
          {saved ? 'Saved!' : isComplete ? 'Update Check-In' : 'Complete Check-In'}
        </Button>
      </div>
    </Layout>
  );
};
