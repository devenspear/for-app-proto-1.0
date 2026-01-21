import Dexie, { Table } from 'dexie';
import { DailyUsageEntry, DailyCheckIn, WeeklyReport } from '../../types';

class CharacterInsightsDB extends Dexie {
  dailyUsage!: Table<DailyUsageEntry>;
  dailyCheckIns!: Table<DailyCheckIn>;
  weeklyScores!: Table<WeeklyReport>;

  constructor() {
    super('CharacterInsightsDB');
    this.version(1).stores({
      dailyUsage: '++id, date',
      dailyCheckIns: '++id, date',
      weeklyScores: 'weekStartDate',
    });
  }

  async getUsageForDate(date: string): Promise<DailyUsageEntry | undefined> {
    return this.dailyUsage.where('date').equals(date).first();
  }

  async getUsageForDateRange(startDate: string, endDate: string): Promise<DailyUsageEntry[]> {
    return this.dailyUsage
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  async getCheckInForDate(date: string): Promise<DailyCheckIn | undefined> {
    return this.dailyCheckIns.where('date').equals(date).first();
  }

  async getCheckInsForDateRange(startDate: string, endDate: string): Promise<DailyCheckIn[]> {
    return this.dailyCheckIns
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  async saveUsageEntry(entry: DailyUsageEntry): Promise<number> {
    const existing = await this.getUsageForDate(entry.date);
    if (existing) {
      await this.dailyUsage.update(existing.id!, entry);
      return existing.id!;
    }
    return this.dailyUsage.add(entry);
  }

  async saveCheckIn(checkIn: DailyCheckIn): Promise<number> {
    const existing = await this.getCheckInForDate(checkIn.date);
    if (existing) {
      await this.dailyCheckIns.update(existing.id!, checkIn);
      return existing.id!;
    }
    return this.dailyCheckIns.add(checkIn);
  }

  async clearAllData(): Promise<void> {
    await this.dailyUsage.clear();
    await this.dailyCheckIns.clear();
    await this.weeklyScores.clear();
  }
}

export const db = new CharacterInsightsDB();
