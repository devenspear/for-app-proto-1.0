import { CharacterTheme, ExtractedFeatures, ThemeScore, SignalContribution } from '../../../types';
import { SCORING_WEIGHTS, THRESHOLDS, SELF_REPORT_BOOST } from '../../../constants/scoring';

export interface ThemeScorer {
  theme: CharacterTheme;
  calculate(features: ExtractedFeatures): ThemeScore;
}

// Utility function to normalize a value between thresholds to 0-1 scale
export const normalize = (
  value: number,
  low: number,
  high: number,
  invert: boolean = false
): number => {
  let normalized: number;
  if (invert) {
    // For inverted metrics like steps (low steps = high score)
    if (value >= low) normalized = 0;
    else if (value <= high) normalized = 1;
    else normalized = (low - value) / (low - high);
  } else {
    if (value <= low) normalized = 0;
    else if (value >= high) normalized = 1;
    else normalized = (value - low) / (high - low);
  }
  return Math.max(0, Math.min(1, normalized));
};

// Base class for theme scorers
export abstract class BaseThemeScorer implements ThemeScorer {
  abstract theme: CharacterTheme;

  abstract calculate(features: ExtractedFeatures): ThemeScore;

  protected createScore(
    contributions: SignalContribution[],
    features: ExtractedFeatures
  ): ThemeScore {
    const weights = SCORING_WEIGHTS[this.theme];

    // Calculate weighted sum
    let totalWeight = 0;
    let weightedSum = 0;

    for (const contrib of contributions) {
      const weight = weights[contrib.source] || 0;
      weightedSum += contrib.normalizedValue * weight;
      totalWeight += weight;
    }

    // Add self-report boost if this theme was selected
    if (features.selfReportedTheme === this.theme) {
      const selfReportWeight = weights.selfReport || 0;
      weightedSum += SELF_REPORT_BOOST * selfReportWeight;
      totalWeight += selfReportWeight;

      contributions.push({
        source: 'selfReport',
        label: 'Self-reported in check-in',
        weight: selfReportWeight,
        rawValue: 1,
        normalizedValue: SELF_REPORT_BOOST,
      });
    }

    // Calculate final score (0-10)
    const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) * 10 : 0;
    const confidence = Math.min(totalWeight, 1);

    // Generate top contributors
    const topContributors = contributions
      .filter(c => c.normalizedValue > 0.3)
      .sort((a, b) => b.normalizedValue * b.weight - a.normalizedValue * a.weight)
      .slice(0, 3)
      .map(c => c.label);

    return {
      theme: this.theme,
      score: Math.round(rawScore * 10) / 10,
      confidence,
      trend: 'stable', // Will be calculated separately with historical data
      topContributors,
      signalBreakdown: contributions,
    };
  }
}

// Pride Scorer
export class PrideScorer extends BaseThemeScorer {
  theme = CharacterTheme.PRIDE;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Social media time
    const socialNorm = normalize(
      features.socialMediaMinutes,
      THRESHOLDS.socialMedia.low,
      THRESHOLDS.socialMedia.high
    );
    contributions.push({
      source: 'socialMedia',
      label: `${features.socialMediaMinutes}min on social media`,
      weight: SCORING_WEIGHTS[this.theme].socialMedia,
      rawValue: features.socialMediaMinutes,
      normalizedValue: socialNorm,
    });

    // Phone pickups (seeking validation)
    const pickupsNorm = normalize(
      features.phonePickups,
      THRESHOLDS.phonePickups.low,
      THRESHOLDS.phonePickups.high
    );
    contributions.push({
      source: 'phonePickups',
      label: `${features.phonePickups} phone pickups`,
      weight: SCORING_WEIGHTS[this.theme].phonePickups,
      rawValue: features.phonePickups,
      normalizedValue: pickupsNorm,
    });

    // Late night usage
    const lateNightNorm = normalize(
      features.lateNightUsageMinutes,
      THRESHOLDS.lateNight.low,
      THRESHOLDS.lateNight.high
    );
    contributions.push({
      source: 'lateNight',
      label: `${features.lateNightUsageMinutes}min late night usage`,
      weight: SCORING_WEIGHTS[this.theme].lateNight,
      rawValue: features.lateNightUsageMinutes,
      normalizedValue: lateNightNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Greed Scorer
export class GreedScorer extends BaseThemeScorer {
  theme = CharacterTheme.GREED;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Shopping time
    const shoppingNorm = normalize(
      features.shoppingMinutes,
      THRESHOLDS.shopping.low,
      THRESHOLDS.shopping.high
    );
    contributions.push({
      source: 'shopping',
      label: `${features.shoppingMinutes}min on shopping apps`,
      weight: SCORING_WEIGHTS[this.theme].shopping,
      rawValue: features.shoppingMinutes,
      normalizedValue: shoppingNorm,
    });

    // Overall screen time
    const screenNorm = normalize(
      features.totalScreenTimeMinutes,
      THRESHOLDS.screenTime.low,
      THRESHOLDS.screenTime.high
    );
    contributions.push({
      source: 'screenTime',
      label: `${features.totalScreenTimeMinutes}min total screen time`,
      weight: SCORING_WEIGHTS[this.theme].screenTime,
      rawValue: features.totalScreenTimeMinutes,
      normalizedValue: screenNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Lust Scorer
export class LustScorer extends BaseThemeScorer {
  theme = CharacterTheme.LUST;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Dating apps time
    const datingNorm = normalize(
      features.datingAppsMinutes,
      THRESHOLDS.dating.low,
      THRESHOLDS.dating.high
    );
    contributions.push({
      source: 'dating',
      label: `${features.datingAppsMinutes}min on dating apps`,
      weight: SCORING_WEIGHTS[this.theme].dating,
      rawValue: features.datingAppsMinutes,
      normalizedValue: datingNorm,
    });

    // Late night usage
    const lateNightNorm = normalize(
      features.lateNightUsageMinutes,
      THRESHOLDS.lateNight.low,
      THRESHOLDS.lateNight.high
    );
    contributions.push({
      source: 'lateNight',
      label: `${features.lateNightUsageMinutes}min late night usage`,
      weight: SCORING_WEIGHTS[this.theme].lateNight,
      rawValue: features.lateNightUsageMinutes,
      normalizedValue: lateNightNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Anger Scorer (primarily self-report)
export class AngerScorer extends BaseThemeScorer {
  theme = CharacterTheme.ANGER;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Late night (potential conflict indicator)
    const lateNightNorm = normalize(
      features.lateNightUsageMinutes,
      THRESHOLDS.lateNight.low,
      THRESHOLDS.lateNight.high
    );
    contributions.push({
      source: 'lateNight',
      label: `${features.lateNightUsageMinutes}min late night usage`,
      weight: SCORING_WEIGHTS[this.theme].lateNight,
      rawValue: features.lateNightUsageMinutes,
      normalizedValue: lateNightNorm,
    });

    // Phone pickups (agitation indicator)
    const pickupsNorm = normalize(
      features.phonePickups,
      THRESHOLDS.phonePickups.low,
      THRESHOLDS.phonePickups.high
    );
    contributions.push({
      source: 'phonePickups',
      label: `${features.phonePickups} phone pickups`,
      weight: SCORING_WEIGHTS[this.theme].phonePickups,
      rawValue: features.phonePickups,
      normalizedValue: pickupsNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Gluttony Scorer
export class GluttonyScorer extends BaseThemeScorer {
  theme = CharacterTheme.GLUTTONY;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Entertainment time
    const entertainmentNorm = normalize(
      features.entertainmentMinutes,
      THRESHOLDS.entertainment.low,
      THRESHOLDS.entertainment.high
    );
    contributions.push({
      source: 'entertainment',
      label: `${features.entertainmentMinutes}min on entertainment`,
      weight: SCORING_WEIGHTS[this.theme].entertainment,
      rawValue: features.entertainmentMinutes,
      normalizedValue: entertainmentNorm,
    });

    // Late night usage
    const lateNightNorm = normalize(
      features.lateNightUsageMinutes,
      THRESHOLDS.lateNight.low,
      THRESHOLDS.lateNight.high
    );
    contributions.push({
      source: 'lateNight',
      label: `${features.lateNightUsageMinutes}min late night usage`,
      weight: SCORING_WEIGHTS[this.theme].lateNight,
      rawValue: features.lateNightUsageMinutes,
      normalizedValue: lateNightNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Envy Scorer
export class EnvyScorer extends BaseThemeScorer {
  theme = CharacterTheme.ENVY;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Social media (comparison)
    const socialNorm = normalize(
      features.socialMediaMinutes,
      THRESHOLDS.socialMedia.low,
      THRESHOLDS.socialMedia.high
    );
    contributions.push({
      source: 'socialMedia',
      label: `${features.socialMediaMinutes}min on social media`,
      weight: SCORING_WEIGHTS[this.theme].socialMedia,
      rawValue: features.socialMediaMinutes,
      normalizedValue: socialNorm,
    });

    // Phone pickups (repeated checking)
    const pickupsNorm = normalize(
      features.phonePickups,
      THRESHOLDS.phonePickups.low,
      THRESHOLDS.phonePickups.high
    );
    contributions.push({
      source: 'phonePickups',
      label: `${features.phonePickups} phone pickups`,
      weight: SCORING_WEIGHTS[this.theme].phonePickups,
      rawValue: features.phonePickups,
      normalizedValue: pickupsNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Sloth Scorer
export class SlothScorer extends BaseThemeScorer {
  theme = CharacterTheme.SLOTH;

  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];

    // Low steps (inverted)
    const stepsNorm = normalize(
      features.steps,
      THRESHOLDS.steps.low,
      THRESHOLDS.steps.high,
      true // invert
    );
    contributions.push({
      source: 'steps',
      label: `${features.steps} steps`,
      weight: SCORING_WEIGHTS[this.theme].steps,
      rawValue: features.steps,
      normalizedValue: stepsNorm,
    });

    // High screen time
    const screenNorm = normalize(
      features.totalScreenTimeMinutes,
      THRESHOLDS.screenTime.low,
      THRESHOLDS.screenTime.high
    );
    contributions.push({
      source: 'screenTime',
      label: `${features.totalScreenTimeMinutes}min screen time`,
      weight: SCORING_WEIGHTS[this.theme].screenTime,
      rawValue: features.totalScreenTimeMinutes,
      normalizedValue: screenNorm,
    });

    // Late wake time
    const wakeNorm = normalize(
      features.wakeTimeHour,
      THRESHOLDS.wakeTime.low,
      THRESHOLDS.wakeTime.high
    );
    contributions.push({
      source: 'wakeTime',
      label: `Woke at ${features.wakeTimeHour}:00`,
      weight: SCORING_WEIGHTS[this.theme].wakeTime,
      rawValue: features.wakeTimeHour,
      normalizedValue: wakeNorm,
    });

    return this.createScore(contributions, features);
  }
}

// Self-report only scorers (Fear, Self-Pity, Guilt, Shame, Dishonesty)
abstract class SelfReportOnlyScorer extends BaseThemeScorer {
  calculate(features: ExtractedFeatures): ThemeScore {
    const contributions: SignalContribution[] = [];
    // Self-report is handled in createScore
    return this.createScore(contributions, features);
  }
}

export class FearScorer extends SelfReportOnlyScorer {
  theme = CharacterTheme.FEAR;
}

export class SelfPityScorer extends SelfReportOnlyScorer {
  theme = CharacterTheme.SELF_PITY;
}

export class GuiltScorer extends SelfReportOnlyScorer {
  theme = CharacterTheme.GUILT;
}

export class ShameScorer extends SelfReportOnlyScorer {
  theme = CharacterTheme.SHAME;
}

export class DishonestyScorer extends SelfReportOnlyScorer {
  theme = CharacterTheme.DISHONESTY;
}

// Export all scorers
export const ALL_SCORERS: ThemeScorer[] = [
  new PrideScorer(),
  new GreedScorer(),
  new LustScorer(),
  new AngerScorer(),
  new GluttonyScorer(),
  new EnvyScorer(),
  new SlothScorer(),
  new FearScorer(),
  new SelfPityScorer(),
  new GuiltScorer(),
  new ShameScorer(),
  new DishonestyScorer(),
];
