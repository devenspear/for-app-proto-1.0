import React, { useState, useEffect } from 'react';
import { CheckCircle, Flame, Calendar, BookOpen, Save } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { useDataStore } from '../store/useDataStore';
import { CharacterTheme, DailyCheckIn as CheckInType } from '../types';
import { THEME_DEFINITIONS } from '../constants/themes';
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
            <h1 className="text-2xl font-bold" style={{ color: '#18181b' }}>Daily Check-In</h1>
            <p className="flex items-center gap-2 mt-1" style={{ color: '#71717a' }}>
              <Calendar size={16} />
              {formatDate(getToday())}
            </p>
          </div>
          {checkInStreak.currentStreak > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: 'linear-gradient(to right, #f97316, #f59e0b)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
            >
              <Flame size={18} />
              <span className="font-bold">{checkInStreak.currentStreak}</span>
              <span style={{ color: '#fed7aa' }} className="text-sm">day{checkInStreak.currentStreak !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Already completed indicator */}
        {isComplete && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857' }}
          >
            <CheckCircle size={20} />
            <span className="text-sm font-medium">You've already checked in today. You can update your entry below.</span>
          </div>
        )}

        {/* Mood Selector */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h2 className="font-semibold" style={{ color: '#18181b' }}>How are you feeling today?</h2>
          </div>
          <div className="p-5">
            <div className="flex justify-between gap-1">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMoodScore(option.value)}
                  className="flex-1 py-3 rounded-xl transition-all duration-150 flex flex-col items-center gap-1"
                  style={{
                    backgroundColor: moodScore === option.value ? '#e0e7ff' : 'transparent',
                    transform: moodScore === option.value ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: moodScore === option.value ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none'
                  }}
                >
                  <span className="text-2xl">{option.emoji}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-3 px-2" style={{ color: '#a1a1aa' }}>
              <span>Struggling</span>
              <span>Thriving</span>
            </div>
            <p className="text-center mt-4">
              <span className="text-3xl font-bold" style={{ color: '#4f46e5' }}>{moodScore}</span>
              <span className="text-lg" style={{ color: '#a1a1aa' }}>/10</span>
              <span className="block text-sm mt-1" style={{ color: '#71717a' }}>
                {MOOD_OPTIONS.find(o => o.value === moodScore)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* Theme Picker */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h2 className="font-semibold" style={{ color: '#18181b' }}>Which theme showed up most today?</h2>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
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
                    className="p-3 rounded-xl transition-all duration-150 text-center"
                    style={{
                      backgroundColor: isSelected ? `${def.color}15` : '#f9fafb',
                      border: isSelected ? `2px solid ${def.color}` : '2px solid transparent',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: def.color }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: isSelected ? '#18181b' : '#52525b' }}
                    >
                      {def.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Journal Entry */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <BookOpen size={18} style={{ color: '#71717a' }} />
            <h2 className="font-semibold" style={{ color: '#18181b' }}>Journal</h2>
            <span
              className="text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#f4f4f5', color: '#71717a' }}
            >
              Optional
            </span>
          </div>
          <div className="p-5">
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Any thoughts, reflections, or observations from today..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #d4d4d8',
                borderRadius: '0.75rem',
                color: '#18181b',
                fontSize: '0.875rem',
                resize: 'none',
                outline: 'none'
              }}
            />
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#71717a' }}>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#10b981' }}
              />
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
          leftIcon={!saved ? <Save size={18} /> : <CheckCircle size={18} />}
        >
          {saved ? 'Saved Successfully!' : isComplete ? 'Update Check-In' : 'Save Check-In'}
        </Button>

        {/* Save confirmation */}
        {saved && (
          <div
            className="text-center py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#d1fae5', color: '#047857' }}
          >
            Your check-in has been saved to local storage
          </div>
        )}
      </div>
    </Layout>
  );
};
