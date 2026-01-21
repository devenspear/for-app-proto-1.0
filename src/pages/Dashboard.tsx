import React, { useEffect, useState } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { useAppStore } from '../store/useAppStore';
import { ThemeScore, CharacterTheme } from '../types';
import { Layout } from '../components/common/Layout';
import { WeeklyBarChart } from '../components/charts/WeeklyBarChart';
import { WeekSelector } from '../components/dashboard/WeekSelector';
import { ThemeCard } from '../components/dashboard/ThemeCard';
import { InsightsSummary } from '../components/dashboard/InsightsSummary';
import { ThemeDetailModal } from '../components/dashboard/ThemeDetailModal';

export const Dashboard: React.FC = () => {
  const {
    currentWeekReport,
    selectedWeekStart,
    isLoading,
    error,
    setSelectedWeek,
    loadWeeklyReport,
  } = useDataStore();

  const { hiddenThemes } = useAppStore();

  const [selectedTheme, setSelectedTheme] = useState<ThemeScore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadWeeklyReport();
  }, []);

  const handleBarClick = (theme: CharacterTheme) => {
    const score = currentWeekReport?.scores.find((s) => s.theme === theme);
    if (score) {
      setSelectedTheme(score);
      setIsModalOpen(true);
    }
  };

  const handleCardClick = (score: ThemeScore) => {
    setSelectedTheme(score);
    setIsModalOpen(true);
  };

  // Sort scores by value descending, filter hidden themes
  const sortedScores = currentWeekReport?.scores
    .filter((s) => !hiddenThemes.includes(s.theme))
    .sort((a, b) => b.score - a.score) || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Week Selector */}
        <WeekSelector
          selectedWeek={selectedWeekStart}
          onWeekChange={setSelectedWeek}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-neutral-500 mt-3 text-sm">Loading your insights...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && currentWeekReport && (
          <>
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary-500" />
                    Weekly Overview
                  </h2>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Tap any bar to see details
                  </p>
                </div>
              </div>
              <div className="p-5">
                <WeeklyBarChart
                  scores={currentWeekReport.scores}
                  onBarClick={handleBarClick}
                  hiddenThemes={hiddenThemes}
                />
              </div>
            </div>

            {/* Insights Summary */}
            <InsightsSummary
              highlights={currentWeekReport.highlights}
              prompts={currentWeekReport.reflectivePrompts}
            />

            {/* Theme Cards */}
            <div>
              <h2 className="font-semibold text-neutral-900 mb-3 px-1">All Themes</h2>
              <div className="space-y-3">
                {sortedScores.map((score, idx) => (
                  <div
                    key={score.theme}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <ThemeCard
                      score={score}
                      onClick={() => handleCardClick(score)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!isLoading && !error && (!currentWeekReport || sortedScores.length === 0) && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-neutral-400" />
            </div>
            <h3 className="font-semibold text-neutral-900">No data for this week</h3>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto">
              Enter your daily data or complete a check-in to see your weekly insights and scores.
            </p>
          </div>
        )}
      </div>

      {/* Theme Detail Modal */}
      <ThemeDetailModal
        score={selectedTheme}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};
