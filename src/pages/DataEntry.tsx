import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Clock, Smartphone, Heart, Activity, Moon, Footprints, Calendar } from 'lucide-react';
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
        <label className="text-sm font-medium text-neutral-700">{label}</label>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg"
          style={{ backgroundColor: `${color}15`, color }}
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
          className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer slider-input"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Daily Data Entry</h1>
            <p className="text-neutral-500 flex items-center gap-2 mt-1">
              <Calendar size={16} />
              {formatDate(getToday())}
            </p>
          </div>
        </div>

        {/* App Usage Section */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Smartphone size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">App Usage</h2>
              <p className="text-sm text-neutral-500">Time spent in each category (minutes)</p>
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
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Activity size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">Behavior</h2>
              <p className="text-sm text-neutral-500">Phone usage patterns</p>
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
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Heart size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">Health</h2>
              <p className="text-sm text-neutral-500">Physical activity and sleep</p>
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
                <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <Clock size={16} className="text-neutral-400" />
                  Wake Time
                </label>
              </div>
              <input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => updateField('wakeTime', e.target.value)}
                className="
                  w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl
                  text-neutral-900
                  focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                  transition-all duration-150
                "
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
            leftIcon={!saved ? <Save size={18} /> : undefined}
          >
            {saved ? 'Saved!' : 'Save Entry'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};
