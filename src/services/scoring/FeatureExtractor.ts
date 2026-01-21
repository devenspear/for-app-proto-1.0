import { DailyUsageEntry, DailyCheckIn, ExtractedFeatures } from '../../types';

export class FeatureExtractor {
  extract(usage: DailyUsageEntry | undefined, checkIn: DailyCheckIn | undefined): ExtractedFeatures {
    const hasUsage = !!usage;

    // Default values when no data
    const defaults: ExtractedFeatures = {
      date: usage?.date || checkIn?.date || '',
      socialMediaMinutes: 0,
      shoppingMinutes: 0,
      entertainmentMinutes: 0,
      datingAppsMinutes: 0,
      productivityMinutes: 0,
      newsMinutes: 0,
      gamesMinutes: 0,
      totalScreenTimeMinutes: 0,
      passiveConsumptionMinutes: 0,
      phonePickups: 0,
      lateNightUsageMinutes: 0,
      steps: 5000,
      sleepHours: 7,
      wakeTimeHour: 7,
      isLowActivity: false,
      isHighScreenTime: false,
      isLateWake: false,
      isHighLateNight: false,
    };

    if (!hasUsage) {
      // Only check-in data available
      if (checkIn) {
        return {
          ...defaults,
          date: checkIn.date,
          selfReportedTheme: checkIn.primaryTheme,
          moodScore: checkIn.moodScore,
        };
      }
      return defaults;
    }

    // Calculate derived metrics
    const totalScreenTime =
      usage.socialMediaMinutes +
      usage.shoppingMinutes +
      usage.entertainmentMinutes +
      usage.datingAppsMinutes +
      usage.productivityMinutes +
      usage.newsMinutes +
      usage.gamesMinutes;

    const passiveConsumption =
      usage.entertainmentMinutes +
      usage.socialMediaMinutes +
      usage.newsMinutes +
      usage.gamesMinutes;

    // Parse wake time
    const wakeHour = parseInt(usage.wakeTime.split(':')[0], 10);

    return {
      date: usage.date,
      socialMediaMinutes: usage.socialMediaMinutes,
      shoppingMinutes: usage.shoppingMinutes,
      entertainmentMinutes: usage.entertainmentMinutes,
      datingAppsMinutes: usage.datingAppsMinutes,
      productivityMinutes: usage.productivityMinutes,
      newsMinutes: usage.newsMinutes,
      gamesMinutes: usage.gamesMinutes,
      totalScreenTimeMinutes: totalScreenTime,
      passiveConsumptionMinutes: passiveConsumption,
      phonePickups: usage.phonePickups,
      lateNightUsageMinutes: usage.lateNightUsageMinutes,
      steps: usage.steps,
      sleepHours: usage.sleepHours,
      wakeTimeHour: wakeHour,
      selfReportedTheme: checkIn?.primaryTheme,
      moodScore: checkIn?.moodScore,
      isLowActivity: usage.steps < 3000,
      isHighScreenTime: totalScreenTime > 240,
      isLateWake: wakeHour >= 9,
      isHighLateNight: usage.lateNightUsageMinutes > 60,
    };
  }
}

export const featureExtractor = new FeatureExtractor();
