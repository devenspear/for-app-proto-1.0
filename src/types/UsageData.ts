export interface DailyUsageEntry {
  id?: number;
  date: string;                              // YYYY-MM-DD

  // Time in minutes per category
  socialMediaMinutes: number;
  shoppingMinutes: number;
  entertainmentMinutes: number;
  datingAppsMinutes: number;
  productivityMinutes: number;
  newsMinutes: number;
  gamesMinutes: number;

  // Behavioral metrics
  phonePickups: number;
  lateNightUsageMinutes: number;             // After 11pm

  // Health metrics
  steps: number;
  sleepHours: number;
  wakeTime: string;                          // HH:mm

  createdAt: number;
}

export interface ExtractedFeatures {
  date: string;

  // Category time (minutes)
  socialMediaMinutes: number;
  shoppingMinutes: number;
  entertainmentMinutes: number;
  datingAppsMinutes: number;
  productivityMinutes: number;
  newsMinutes: number;
  gamesMinutes: number;

  // Derived metrics
  totalScreenTimeMinutes: number;
  passiveConsumptionMinutes: number;         // Entertainment + Social + News
  phonePickups: number;
  lateNightUsageMinutes: number;

  // Health metrics
  steps: number;
  sleepHours: number;
  wakeTimeHour: number;                      // 0-23

  // Self-report (from check-in if available)
  selfReportedTheme?: string;
  moodScore?: number;

  // Derived patterns
  isLowActivity: boolean;                    // Steps < 3000
  isHighScreenTime: boolean;                 // > 4 hours
  isLateWake: boolean;                       // After 9am
  isHighLateNight: boolean;                  // > 60 min late night usage
}

export const DEFAULT_USAGE_ENTRY: Omit<DailyUsageEntry, 'id' | 'date' | 'createdAt'> = {
  socialMediaMinutes: 60,
  shoppingMinutes: 15,
  entertainmentMinutes: 90,
  datingAppsMinutes: 0,
  productivityMinutes: 120,
  newsMinutes: 30,
  gamesMinutes: 30,
  phonePickups: 50,
  lateNightUsageMinutes: 30,
  steps: 5000,
  sleepHours: 7,
  wakeTime: '07:30',
};
