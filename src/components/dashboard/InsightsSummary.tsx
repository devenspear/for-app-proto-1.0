import React from 'react';
import { Lightbulb, TrendingDown, AlertTriangle, Star, Sparkles } from 'lucide-react';
import { ThemeHighlight, GeneratedPrompt } from '../../types';
import { THEME_DEFINITIONS, getThemeLightBg } from '../../constants/themes';

interface InsightsSummaryProps {
  highlights: ThemeHighlight[];
  prompts: GeneratedPrompt[];
}

export const InsightsSummary: React.FC<InsightsSummaryProps> = ({
  highlights,
  prompts,
}) => {
  if (highlights.length === 0 && prompts.length === 0) {
    return null;
  }

  const getHighlightIcon = (type: ThemeHighlight['type']) => {
    switch (type) {
      case 'highest':
        return Star;
      case 'most_improved':
        return TrendingDown;
      case 'needs_attention':
        return AlertTriangle;
      default:
        return Lightbulb;
    }
  };

  const getHighlightStyles = (type: ThemeHighlight['type']) => {
    switch (type) {
      case 'highest':
        return {
          bg: 'bg-amber-50',
          icon: 'text-amber-500',
          border: 'border-amber-200',
        };
      case 'most_improved':
        return {
          bg: 'bg-emerald-50',
          icon: 'text-emerald-500',
          border: 'border-emerald-200',
        };
      case 'needs_attention':
        return {
          bg: 'bg-orange-50',
          icon: 'text-orange-500',
          border: 'border-orange-200',
        };
      default:
        return {
          bg: 'bg-primary-50',
          icon: 'text-primary-500',
          border: 'border-primary-200',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Sparkles size={18} className="text-primary-500" />
              This Week's Insights
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {highlights.map((highlight, idx) => {
              const Icon = getHighlightIcon(highlight.type);
              const styles = getHighlightStyles(highlight.type);
              return (
                <div
                  key={idx}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl
                    ${styles.bg} border ${styles.border}
                  `}
                >
                  <div className={`p-1.5 rounded-lg bg-white/60 ${styles.icon}`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {highlight.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reflective Prompts */}
      {prompts.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              Reflective Prompts
            </h3>
            <p className="text-sm text-neutral-500 mt-0.5">
              Questions to guide your reflection
            </p>
          </div>
          <div className="p-4 space-y-3">
            {prompts.map((prompt, idx) => {
              const theme = THEME_DEFINITIONS[prompt.theme];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-100"
                  style={{ backgroundColor: `${getThemeLightBg(prompt.theme)}40` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {theme.name}
                    </span>
                  </div>
                  <p className="text-neutral-700 italic leading-relaxed">
                    "{prompt.prompt}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
