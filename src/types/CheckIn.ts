import { CharacterTheme } from './Theme';

export interface DailyCheckIn {
  id?: number;
  date: string;                              // YYYY-MM-DD
  moodScore: number;                         // 1-10
  primaryTheme: CharacterTheme;
  journalEntry?: string;
  createdAt: number;
}

export interface CheckInStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
}
