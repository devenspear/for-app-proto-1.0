import React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { ThemeScore } from '../../types';
import { THEME_DEFINITIONS, getThemeLightBg } from '../../constants/themes';

interface ThemeCardProps {
  score: ThemeScore;
  onClick?: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ score, onClick }) => {
  const theme = THEME_DEFINITIONS[score.theme];

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[score.trend];

  const trendColor = {
    up: 'text-red-500',
    down: 'text-emerald-500',
    stable: 'text-neutral-400',
  }[score.trend];

  const trendBg = {
    up: 'bg-red-50',
    down: 'bg-emerald-50',
    stable: 'bg-neutral-100',
  }[score.trend];

  // Score color and styling based on value
  const getScoreStyles = (value: number) => {
    if (value <= 3) return { text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (value <= 5) return { text: 'text-amber-600', bg: 'bg-amber-50' };
    if (value <= 7) return { text: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreStyles = getScoreStyles(score.score);

  return (
    <div
      onClick={onClick}
      className="
        group bg-white rounded-2xl border border-neutral-100 p-4
        shadow-soft hover-lift cursor-pointer
        flex items-center gap-4
      "
    >
      {/* Theme icon with background */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: getThemeLightBg(score.theme) }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: theme.color }}
        />
      </div>

      {/* Theme info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
          {theme.name}
        </h3>
        {score.topContributors.length > 0 && (
          <p className="text-sm text-neutral-500 truncate mt-0.5">
            {score.topContributors[0]}
          </p>
        )}
      </div>

      {/* Score and trend */}
      <div className="flex items-center gap-3">
        {/* Score badge */}
        <div className={`px-3 py-1.5 rounded-lg ${scoreStyles.bg}`}>
          <span className={`text-lg font-bold ${scoreStyles.text}`}>
            {score.score}
          </span>
          <span className="text-neutral-400 text-sm">/10</span>
        </div>

        {/* Trend indicator */}
        <div className={`p-1.5 rounded-lg ${trendBg}`}>
          <TrendIcon size={16} className={trendColor} />
        </div>

        {/* Chevron */}
        <ChevronRight
          size={18}
          className="text-neutral-300 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </div>
  );
};
