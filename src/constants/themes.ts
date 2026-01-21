import { CharacterTheme, ThemeDefinition } from '../types';

export const THEME_DEFINITIONS: Record<CharacterTheme, ThemeDefinition> = {
  [CharacterTheme.PRIDE]: {
    id: CharacterTheme.PRIDE,
    name: 'Pride',
    description: 'Excessive focus on self-image, seeking validation, and comparing yourself favorably to others.',
    color: '#7c3aed',
    icon: 'Crown',
    reflectivePrompts: [
      'What drove my need for recognition today?',
      'How did I respond when I didn\'t receive the attention I expected?',
      'What would happen if I celebrated someone else\'s success today?',
    ],
  },
  [CharacterTheme.GREED]: {
    id: CharacterTheme.GREED,
    name: 'Greed',
    description: 'Excessive desire for material possessions or wealth beyond what is needed.',
    color: '#d97706',
    icon: 'Coins',
    reflectivePrompts: [
      'What purchases today were truly necessary vs. impulsive?',
      'What am I trying to fill by acquiring more things?',
      'What do I already have that I could be more grateful for?',
    ],
  },
  [CharacterTheme.LUST]: {
    id: CharacterTheme.LUST,
    name: 'Lust',
    description: 'Intense desires that distract from meaningful connections and personal growth.',
    color: '#db2777',
    icon: 'Heart',
    reflectivePrompts: [
      'What emotions was I avoiding when I felt this pull?',
      'How can I channel this energy into something constructive?',
      'What healthier ways can I meet my need for connection?',
    ],
  },
  [CharacterTheme.ANGER]: {
    id: CharacterTheme.ANGER,
    name: 'Anger',
    description: 'Intense feelings of frustration, resentment, or hostility toward others or situations.',
    color: '#dc2626',
    icon: 'Flame',
    reflectivePrompts: [
      'What was I really feeling underneath my anger today?',
      'What boundary was crossed that triggered this response?',
      'How might I respond differently next time?',
    ],
  },
  [CharacterTheme.GLUTTONY]: {
    id: CharacterTheme.GLUTTONY,
    name: 'Gluttony',
    description: 'Excessive consumption of entertainment, media, or other indulgences.',
    color: '#ea580c',
    icon: 'Tv',
    reflectivePrompts: [
      'What was I avoiding by consuming so much content?',
      'How did I feel after extended screen time?',
      'What activities bring me fulfillment that I\'m neglecting?',
    ],
  },
  [CharacterTheme.ENVY]: {
    id: CharacterTheme.ENVY,
    name: 'Envy',
    description: 'Resentment or longing for what others have, whether possessions, qualities, or experiences.',
    color: '#059669',
    icon: 'Eye',
    reflectivePrompts: [
      'Whose life was I comparing myself to today?',
      'What do I have that I\'m taking for granted?',
      'How might I turn admiration into inspiration instead of envy?',
    ],
  },
  [CharacterTheme.SLOTH]: {
    id: CharacterTheme.SLOTH,
    name: 'Sloth',
    description: 'Avoidance of physical, emotional, or spiritual effort and growth.',
    color: '#6b7280',
    icon: 'Moon',
    reflectivePrompts: [
      'What important task did I avoid today?',
      'What small step could I take tomorrow toward my goals?',
      'What\'s the cost of staying comfortable?',
    ],
  },
  [CharacterTheme.FEAR]: {
    id: CharacterTheme.FEAR,
    name: 'Fear',
    description: 'Anxiety, worry, or avoidance driven by concerns about the future or potential threats.',
    color: '#2563eb',
    icon: 'Shield',
    reflectivePrompts: [
      'What am I afraid might happen?',
      'What evidence do I have that my fear is realistic?',
      'What would I do if I weren\'t afraid?',
    ],
  },
  [CharacterTheme.SELF_PITY]: {
    id: CharacterTheme.SELF_PITY,
    name: 'Self-Pity',
    description: 'Excessive focus on one\'s own misfortunes and feeling victimized by circumstances.',
    color: '#0891b2',
    icon: 'CloudRain',
    reflectivePrompts: [
      'What story am I telling myself about my situation?',
      'What power do I have to change my circumstances?',
      'Who might be struggling more than me right now?',
    ],
  },
  [CharacterTheme.GUILT]: {
    id: CharacterTheme.GUILT,
    name: 'Guilt',
    description: 'Excessive remorse or self-blame for past actions, often beyond what is proportionate.',
    color: '#7c3aed',
    icon: 'Scale',
    reflectivePrompts: [
      'What am I holding onto that I need to release?',
      'Have I made amends where possible?',
      'What would I tell a friend who felt this way?',
    ],
  },
  [CharacterTheme.SHAME]: {
    id: CharacterTheme.SHAME,
    name: 'Shame',
    description: 'Deep feelings of unworthiness or inadequacy about who you are as a person.',
    color: '#c026d3',
    icon: 'EyeOff',
    reflectivePrompts: [
      'What am I hiding from others?',
      'Where did this belief about myself come from?',
      'What would self-compassion look like right now?',
    ],
  },
  [CharacterTheme.DISHONESTY]: {
    id: CharacterTheme.DISHONESTY,
    name: 'Dishonesty',
    description: 'Deception of self or others, including rationalizations, omissions, and self-deception.',
    color: '#475569',
    icon: 'Mask',
    reflectivePrompts: [
      'What truth am I avoiding?',
      'Who am I pretending to be?',
      'What would radical honesty look like today?',
    ],
  },
};

// Helper to get theme light background color
export const getThemeLightBg = (theme: CharacterTheme): string => {
  const lightBgMap: Record<CharacterTheme, string> = {
    [CharacterTheme.PRIDE]: '#ede9fe',
    [CharacterTheme.GREED]: '#fef3c7',
    [CharacterTheme.LUST]: '#fce7f3',
    [CharacterTheme.ANGER]: '#fee2e2',
    [CharacterTheme.GLUTTONY]: '#ffedd5',
    [CharacterTheme.ENVY]: '#d1fae5',
    [CharacterTheme.SLOTH]: '#f3f4f6',
    [CharacterTheme.FEAR]: '#dbeafe',
    [CharacterTheme.SELF_PITY]: '#cffafe',
    [CharacterTheme.GUILT]: '#ede9fe',
    [CharacterTheme.SHAME]: '#fae8ff',
    [CharacterTheme.DISHONESTY]: '#f1f5f9',
  };
  return lightBgMap[theme];
};

export const THEME_COLORS = Object.fromEntries(
  Object.values(THEME_DEFINITIONS).map(t => [t.id, t.color])
) as Record<CharacterTheme, string>;

export const THEME_NAMES = Object.fromEntries(
  Object.values(THEME_DEFINITIONS).map(t => [t.id, t.name])
) as Record<CharacterTheme, string>;
