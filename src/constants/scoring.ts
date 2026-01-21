import { CharacterTheme } from '../types';

// Weight distribution for each theme's scoring
// Weights should sum to 1.0 for each theme
export const SCORING_WEIGHTS: Record<CharacterTheme, Record<string, number>> = {
  [CharacterTheme.PRIDE]: {
    socialMedia: 0.4,
    selfReport: 0.3,
    phonePickups: 0.15,
    lateNight: 0.15,
  },
  [CharacterTheme.GREED]: {
    shopping: 0.5,
    selfReport: 0.3,
    screenTime: 0.2,
  },
  [CharacterTheme.LUST]: {
    dating: 0.4,
    selfReport: 0.3,
    lateNight: 0.3,
  },
  [CharacterTheme.ANGER]: {
    selfReport: 0.8,
    lateNight: 0.1,
    phonePickups: 0.1,
  },
  [CharacterTheme.GLUTTONY]: {
    entertainment: 0.4,
    lateNight: 0.3,
    selfReport: 0.3,
  },
  [CharacterTheme.ENVY]: {
    socialMedia: 0.5,
    phonePickups: 0.2,
    selfReport: 0.3,
  },
  [CharacterTheme.SLOTH]: {
    steps: 0.3,
    screenTime: 0.3,
    wakeTime: 0.2,
    selfReport: 0.2,
  },
  [CharacterTheme.FEAR]: {
    selfReport: 1.0,
  },
  [CharacterTheme.SELF_PITY]: {
    selfReport: 1.0,
  },
  [CharacterTheme.GUILT]: {
    selfReport: 1.0,
  },
  [CharacterTheme.SHAME]: {
    selfReport: 1.0,
  },
  [CharacterTheme.DISHONESTY]: {
    selfReport: 1.0,
  },
};

// Thresholds for normalizing raw values to 0-1 scale
// [low, high] - values below low = 0, above high = 1
export const THRESHOLDS = {
  socialMedia: { low: 30, high: 180 },         // minutes
  shopping: { low: 10, high: 60 },             // minutes
  entertainment: { low: 60, high: 240 },       // minutes
  dating: { low: 5, high: 60 },                // minutes
  screenTime: { low: 120, high: 360 },         // minutes total
  lateNight: { low: 15, high: 90 },            // minutes after 11pm
  phonePickups: { low: 30, high: 100 },        // count
  steps: { low: 8000, high: 2000 },            // inverted - low steps = high score
  wakeTime: { low: 7, high: 10 },              // hour (7am = 0, 10am = 1)
};

// Self-report boost when theme is selected in check-in
export const SELF_REPORT_BOOST = 0.6; // 60% of max score when self-reported

// Minimum confidence required to show a score
export const MIN_CONFIDENCE = 0.1;
