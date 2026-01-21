export enum CharacterTheme {
  PRIDE = 'pride',
  GREED = 'greed',
  LUST = 'lust',
  ANGER = 'anger',
  GLUTTONY = 'gluttony',
  ENVY = 'envy',
  SLOTH = 'sloth',
  FEAR = 'fear',
  SELF_PITY = 'self_pity',
  GUILT = 'guilt',
  SHAME = 'shame',
  DISHONESTY = 'dishonesty',
}

export interface ThemeDefinition {
  id: CharacterTheme;
  name: string;
  description: string;
  color: string;
  icon: string;
  reflectivePrompts: string[];
}

export const ALL_THEMES = Object.values(CharacterTheme);
