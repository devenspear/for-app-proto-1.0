import { CharacterTheme } from './Theme';

export interface SignalContribution {
  source: string;
  label: string;
  weight: number;
  rawValue: number;
  normalizedValue: number;
}

export interface ThemeScore {
  theme: CharacterTheme;
  score: number;                    // 0-10
  confidence: number;               // 0-1 (how much data contributed)
  trend: 'up' | 'down' | 'stable';
  topContributors: string[];
  signalBreakdown: SignalContribution[];
}

export interface ThemeHighlight {
  theme: CharacterTheme;
  type: 'highest' | 'lowest' | 'most_improved' | 'needs_attention';
  message: string;
}

export interface GeneratedPrompt {
  theme: CharacterTheme;
  prompt: string;
}

export interface WeeklyReport {
  weekStartDate: string;
  weekEndDate: string;
  scores: ThemeScore[];
  highlights: ThemeHighlight[];
  reflectivePrompts: GeneratedPrompt[];
}
