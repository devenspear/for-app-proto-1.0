import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { ThemeScore } from '../../types';
import { THEME_DEFINITIONS, getThemeLightBg } from '../../constants/themes';
import { Modal } from '../common/Modal';

interface ThemeDetailModalProps {
  score: ThemeScore | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeDetailModal: React.FC<ThemeDetailModalProps> = ({
  score,
  isOpen,
  onClose,
}) => {
  if (!score) return null;

  const theme = THEME_DEFINITIONS[score.theme];

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[score.trend];

  const trendLabel = {
    up: 'Increasing from last week',
    down: 'Decreasing from last week',
    stable: 'Stable from last week',
  }[score.trend];

  const trendStyles = {
    up: { text: 'text-red-600', bg: 'bg-red-50' },
    down: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
    stable: { text: 'text-neutral-500', bg: 'bg-neutral-100' },
  }[score.trend];

  // Get score color
  const getScoreColor = (value: number) => {
    if (value <= 3) return '#059669'; // emerald
    if (value <= 5) return '#d97706'; // amber
    if (value <= 7) return '#ea580c'; // orange
    return '#dc2626'; // red
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={theme.name}>
      <div className="space-y-6">
        {/* Score display */}
        <div className="flex items-center gap-6 p-4 rounded-2xl" style={{ backgroundColor: getThemeLightBg(score.theme) }}>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-soft"
          >
            <span
              className="text-3xl font-bold"
              style={{ color: getScoreColor(score.score) }}
            >
              {score.score}
            </span>
          </div>
          <div className="flex-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${trendStyles.bg} ${trendStyles.text}`}>
              <TrendIcon size={14} />
              <span>{trendLabel}</span>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              Confidence: <span className="font-medium">{Math.round(score.confidence * 100)}%</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="flex gap-3 p-4 bg-neutral-50 rounded-xl">
          <Info size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-600 leading-relaxed">{theme.description}</p>
        </div>

        {/* Signal Breakdown */}
        {score.signalBreakdown.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">What contributed to this score</h4>
            <div className="space-y-3">
              {score.signalBreakdown.map((signal, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">{signal.label}</p>
                  </div>
                  <div className="flex items-center gap-3 w-32">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${signal.normalizedValue * 100}%`,
                          backgroundColor: theme.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-500 w-8 text-right">
                      {Math.round(signal.normalizedValue * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflective Prompts */}
        <div>
          <h4 className="font-semibold text-neutral-900 mb-3">Reflect on this</h4>
          <div className="space-y-2">
            {theme.reflectivePrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 rounded-xl bg-neutral-50"
              >
                <div
                  className="w-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.color }}
                />
                <p className="text-sm text-neutral-600 italic leading-relaxed">
                  {prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
