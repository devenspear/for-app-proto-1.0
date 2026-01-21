import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatWeekRange, getPreviousWeek, getNextWeek, isFutureWeek, isCurrentWeek } from '../../utils/dates';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (weekStart: string) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  selectedWeek,
  onWeekChange,
}) => {
  const canGoForward = !isFutureWeek(getNextWeek(selectedWeek));
  const isCurrent = isCurrentWeek(selectedWeek);

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-100 shadow-soft p-3">
      <button
        onClick={() => onWeekChange(getPreviousWeek(selectedWeek))}
        className="
          p-2.5 rounded-xl text-neutral-500
          hover:bg-neutral-100 hover:text-neutral-700
          transition-all duration-150 active:scale-95
        "
        aria-label="Previous week"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="text-center flex items-center gap-2">
        <Calendar size={18} className="text-primary-500" />
        <div>
          <p className="font-semibold text-neutral-900">
            {formatWeekRange(selectedWeek)}
          </p>
          {isCurrent && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              This Week
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onWeekChange(getNextWeek(selectedWeek))}
        disabled={!canGoForward}
        className={`
          p-2.5 rounded-xl transition-all duration-150 active:scale-95
          ${canGoForward
            ? 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
            : 'text-neutral-200 cursor-not-allowed'
          }
        `}
        aria-label="Next week"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
