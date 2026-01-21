import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Clock, Smartphone, Heart, Activity, Calendar, CheckCircle } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { useDataStore } from '../store/useDataStore';
import { DailyUsageEntry, DEFAULT_USAGE_ENTRY } from '../types';
import { getToday, formatDate } from '../utils/dates';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  description?: string;
  color?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  description,
  color = '#6366f1',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium" style={{ color: '#3f3f46' }}>{label}</label>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {value} {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e4e4e7 ${percentage}%, #e4e4e7 100%)`,
          }}
        />
      </div>
      {description && (
        <p className="text-xs" style={{ color: '#71717a' }}>{description}</p>
      )}
    </div>
  );
};

export const DataEntry: React.FC = () => {
  const { todaysUsage, saveUsageEntry, loadTodaysData, isLoading } = useDataStore();
  const [formData, setFormData] = useState<Omit<DailyUsageEntry, 'id' | 'date' | 'createdAt'>>(
    DEFAULT_USAGE_ENTRY
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadTodaysData();
  }, []);

  useEffect(() => {
    if (todaysUsage) {
      const { id, date, createdAt, ...rest } = todaysUsage;
      setFormData(rest);
    }
  }, [todaysUsage]);

  const handleSave = async () => {
    const entry: DailyUsageEntry = {
      ...formData,
      date: getToday(),
      createdAt: Date.now(),
    };
    await saveUsageEntry(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setFormData(DEFAULT_USAGE_ENTRY);
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasExistingData = todaysUsage !== null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#18181b' }}>Daily Data Entry</h1>
            <p className="flex items-center gap-2 mt-1" style={{ color: '#71717a' }}>
              <Calendar size={16} />
              {formatDate(getToday())}
            </p>
          </div>
        </div>

        {/* Existing data indicator */}
        {hasExistingData && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', color: '#1d4ed8' }}
          >
            <CheckCircle size={20} />
            <span className="text-sm font-medium">You have existing data for today. Changes will update your entry.</span>
          </div>
        )}

        {/* App Usage Section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#e0e7ff' }}
            >
              <Smartphone size={20} color="#4f46e5" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#18181b' }}>App Usage</h2>
              <p className="text-sm" style={{ color: '#71717a' }}>Time spent in each category (minutes)</p>
            </div>
          </div>
          <div className="p-5 space-y-6">
            <SliderInput
              label="Social Media"
              value={formData.socialMediaMinutes}
              onChange={(v) => updateField('socialMediaMinutes', v)}
              min={0}
              max={300}
              step={5}
              unit="min"
              description="Instagram, Facebook, Twitter, TikTok, etc."
              color="#6366f1"
            />
            <SliderInput
              label="Shopping"
              value={formData.shoppingMinutes}
              onChange={(v) => updateField('shoppingMinutes', v)}
              min={0}
              max={120}
              step={5}
              unit="min"
              description="Amazon, eBay, shopping apps"
              color="#f59e0b"
            />
            <SliderInput
              label="Entertainment"
              value={formData.entertainmentMinutes}
              onChange={(v) => updateField('entertainmentMinutes', v)}
              min={0}
              max={360}
              step={10}
              unit="min"
              description="YouTube, Netflix, streaming, videos"
              color="#ec4899"
            />
            <SliderInput
              label="Dating Apps"
              value={formData.datingAppsMinutes}
              onChange={(v) => updateField('datingAppsMinutes', v)}
              min={0}
              max={120}
              step={5}
              unit="min"
              description="Tinder, Bumble, Hinge, etc."
              color="#ef4444"
            />
            <SliderInput
              label="Productivity"
              value={formData.productivityMinutes}
              onChange={(v) => updateField('productivityMinutes', v)}
              min={0}
              max={480}
              step={15}
              unit="min"
              description="Work apps, email, documents"
              color="#10b981"
            />
            <SliderInput
              label="News"
              value={formData.newsMinutes}
              onChange={(v) => updateField('newsMinutes', v)}
              min={0}
              max={180}
              step={5}
              unit="min"
              description="News apps, articles, feeds"
              color="#3b82f6"
            />
            <SliderInput
              label="Games"
              value={formData.gamesMinutes}
              onChange={(v) => updateField('gamesMinutes', v)}
              min={0}
              max={240}
              step={10}
              unit="min"
              description="Mobile games, gaming apps"
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Behavior Metrics Section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <Activity size={20} color="#d97706" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#18181b' }}>Behavior</h2>
              <p className="text-sm" style={{ color: '#71717a' }}>Phone usage patterns</p>
            </div>
          </div>
          <div className="p-5 space-y-6">
            <SliderInput
              label="Phone Pickups"
              value={formData.phonePickups}
              onChange={(v) => updateField('phonePickups', v)}
              min={0}
              max={200}
              step={5}
              unit="times"
              description="How many times you picked up your phone"
              color="#f59e0b"
            />
            <SliderInput
              label="Late Night Usage (after 11pm)"
              value={formData.lateNightUsageMinutes}
              onChange={(v) => updateField('lateNightUsageMinutes', v)}
              min={0}
              max={180}
              step={5}
              unit="min"
              description="Screen time after 11pm"
              color="#7c3aed"
            />
          </div>
        </div>

        {/* Health Metrics Section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#d1fae5' }}
            >
              <Heart size={20} color="#059669" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#18181b' }}>Health</h2>
              <p className="text-sm" style={{ color: '#71717a' }}>Physical activity and sleep</p>
            </div>
          </div>
          <div className="p-5 space-y-6">
            <SliderInput
              label="Steps"
              value={formData.steps}
              onChange={(v) => updateField('steps', v)}
              min={0}
              max={20000}
              step={500}
              unit="steps"
              color="#10b981"
            />
            <SliderInput
              label="Sleep"
              value={formData.sleepHours}
              onChange={(v) => updateField('sleepHours', v)}
              min={0}
              max={12}
              step={0.5}
              unit="hours"
              color="#6366f1"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: '#3f3f46' }}>
                  <Clock size={16} style={{ color: '#71717a' }} />
                  Wake Time
                </label>
              </div>
              <input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => updateField('wakeTime', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d4d4d8',
                  borderRadius: '0.75rem',
                  color: '#18181b',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            leftIcon={<RotateCcw size={18} />}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isLoading}
            className="flex-1"
            leftIcon={!saved ? <Save size={18} /> : <CheckCircle size={18} />}
          >
            {saved ? 'Saved!' : hasExistingData ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>

        {/* Save confirmation */}
        {saved && (
          <div
            className="text-center py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#d1fae5', color: '#047857' }}
          >
            Your data has been saved to local storage
          </div>
        )}
      </div>
    </Layout>
  );
};
