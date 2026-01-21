import { create } from 'zustand';
import { format, startOfWeek } from 'date-fns';
import {
  DailyUsageEntry,
  DailyCheckIn,
  WeeklyReport,
  CheckInStreak,
} from '../types';
import { db } from '../services/storage/db';
import { scoringEngine } from '../services/scoring/ScoringEngine';

interface DataState {
  // Current data
  currentWeekReport: WeeklyReport | null;
  selectedWeekStart: string;
  todaysUsage: DailyUsageEntry | null;
  todaysCheckIn: DailyCheckIn | null;
  checkInStreak: CheckInStreak;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedWeek: (weekStart: string) => void;
  loadWeeklyReport: (weekStart?: string) => Promise<void>;
  loadTodaysData: () => Promise<void>;
  saveUsageEntry: (entry: DailyUsageEntry) => Promise<void>;
  saveCheckIn: (checkIn: DailyCheckIn) => Promise<void>;
  calculateStreak: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  currentWeekReport: null,
  selectedWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  todaysUsage: null,
  todaysCheckIn: null,
  checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null },
  isLoading: false,
  error: null,

  setSelectedWeek: (weekStart) => {
    set({ selectedWeekStart: weekStart });
    get().loadWeeklyReport(weekStart);
  },

  loadWeeklyReport: async (weekStart) => {
    const targetWeek = weekStart || get().selectedWeekStart;
    set({ isLoading: true, error: null });

    try {
      const report = await scoringEngine.calculateWeeklyReport(targetWeek);
      set({ currentWeekReport: report, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadTodaysData: async () => {
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const usage = await db.getUsageForDate(today);
      const checkIn = await db.getCheckInForDate(today);
      set({ todaysUsage: usage || null, todaysCheckIn: checkIn || null });
    } catch (error) {
      console.error('Failed to load today\'s data:', error);
    }
  },

  saveUsageEntry: async (entry) => {
    set({ isLoading: true });
    try {
      await db.saveUsageEntry(entry);
      await get().loadTodaysData();
      await get().loadWeeklyReport();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveCheckIn: async (checkIn) => {
    set({ isLoading: true });
    try {
      await db.saveCheckIn(checkIn);
      await get().loadTodaysData();
      await get().loadWeeklyReport();
      await get().calculateStreak();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  calculateStreak: async () => {
    try {
      const checkIns = await db.dailyCheckIns.orderBy('date').reverse().toArray();

      if (checkIns.length === 0) {
        set({ checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null } });
        return;
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: string | null = null;

      // Sort by date descending
      const sortedCheckIns = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));

      for (let i = 0; i < sortedCheckIns.length; i++) {
        const checkIn = sortedCheckIns[i];

        if (i === 0) {
          // First check-in
          if (checkIn.date === today || checkIn.date === yesterday) {
            currentStreak = 1;
            tempStreak = 1;
          }
          lastDate = checkIn.date;
        } else {
          // Check if consecutive
          const prevDate = new Date(lastDate!);
          prevDate.setDate(prevDate.getDate() - 1);
          const expectedDate = format(prevDate, 'yyyy-MM-dd');

          if (checkIn.date === expectedDate) {
            tempStreak++;
            if (i < sortedCheckIns.length && currentStreak > 0) {
              currentStreak = tempStreak;
            }
          } else {
            tempStreak = 1;
            if (currentStreak === 0) {
              currentStreak = 0; // Streak broken
            }
          }
          lastDate = checkIn.date;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
      }

      set({
        checkInStreak: {
          currentStreak,
          longestStreak,
          lastCheckInDate: sortedCheckIns[0]?.date || null,
        },
      });
    } catch (error) {
      console.error('Failed to calculate streak:', error);
    }
  },

  clearAllData: async () => {
    set({ isLoading: true });
    try {
      await db.clearAllData();
      set({
        currentWeekReport: null,
        todaysUsage: null,
        todaysCheckIn: null,
        checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
