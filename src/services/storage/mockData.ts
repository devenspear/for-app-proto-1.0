import { format, subDays } from 'date-fns';
import { DailyUsageEntry, DailyCheckIn, CharacterTheme } from '../../types';
import { db } from './db';

// Generate realistic variation
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomTheme = (): CharacterTheme => {
  const themes = Object.values(CharacterTheme);
  return themes[Math.floor(Math.random() * themes.length)];
};

// Generate 14 days of mock data
export const generateMockData = async (): Promise<void> => {
  const today = new Date();

  const usageEntries: DailyUsageEntry[] = [];
  const checkIns: DailyCheckIn[] = [];

  for (let i = 13; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const dayOfWeek = subDays(today, i).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Weekend vs weekday patterns
    const baseScreen = isWeekend ? 1.3 : 1.0;
    const baseActivity = isWeekend ? 0.8 : 1.0;

    const usageEntry: DailyUsageEntry = {
      date,
      socialMediaMinutes: Math.round(randomInRange(45, 120) * baseScreen),
      shoppingMinutes: randomInRange(5, 40),
      entertainmentMinutes: Math.round(randomInRange(60, 180) * baseScreen),
      datingAppsMinutes: randomInRange(0, 30),
      productivityMinutes: Math.round(randomInRange(60, 180) * baseActivity),
      newsMinutes: randomInRange(15, 60),
      gamesMinutes: Math.round(randomInRange(15, 90) * baseScreen),
      phonePickups: randomInRange(40, 90),
      lateNightUsageMinutes: randomInRange(10, 75),
      steps: Math.round(randomInRange(3000, 10000) * baseActivity),
      sleepHours: randomInRange(5, 9),
      wakeTime: `${randomInRange(6, 9).toString().padStart(2, '0')}:${randomInRange(0, 59).toString().padStart(2, '0')}`,
      createdAt: Date.now() - i * 24 * 60 * 60 * 1000,
    };

    usageEntries.push(usageEntry);

    // Generate check-ins for most days (80% completion rate)
    if (Math.random() > 0.2) {
      const checkIn: DailyCheckIn = {
        date,
        moodScore: randomInRange(4, 9),
        primaryTheme: randomTheme(),
        journalEntry: i % 3 === 0 ? `Day ${14 - i} reflection notes...` : undefined,
        createdAt: Date.now() - i * 24 * 60 * 60 * 1000,
      };
      checkIns.push(checkIn);
    }
  }

  // Clear existing data and insert mock data
  await db.clearAllData();
  await db.dailyUsage.bulkAdd(usageEntries);
  await db.dailyCheckIns.bulkAdd(checkIns);
};

// Specific scenario data for demos
export const generateHighPrideScenario = async (): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd');

  await db.saveUsageEntry({
    date: today,
    socialMediaMinutes: 200,  // Very high
    shoppingMinutes: 20,
    entertainmentMinutes: 90,
    datingAppsMinutes: 15,
    productivityMinutes: 60,
    newsMinutes: 30,
    gamesMinutes: 45,
    phonePickups: 95,  // High
    lateNightUsageMinutes: 45,
    steps: 4500,
    sleepHours: 6,
    wakeTime: '08:30',
    createdAt: Date.now(),
  });
};

export const generateHighSlothScenario = async (): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd');

  await db.saveUsageEntry({
    date: today,
    socialMediaMinutes: 90,
    shoppingMinutes: 10,
    entertainmentMinutes: 280,  // Very high passive consumption
    datingAppsMinutes: 5,
    productivityMinutes: 30,  // Low
    newsMinutes: 60,
    gamesMinutes: 120,
    phonePickups: 75,
    lateNightUsageMinutes: 90,  // High late night
    steps: 1500,  // Very low
    sleepHours: 10,  // Oversleeping
    wakeTime: '10:30',  // Late wake
    createdAt: Date.now(),
  });
};
