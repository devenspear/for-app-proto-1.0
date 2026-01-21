import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Onboarding
  isOnboarded: boolean;
  hasConsented: boolean;

  // Settings
  hiddenThemes: string[];

  // Actions
  setOnboarded: (value: boolean) => void;
  setConsent: (value: boolean) => void;
  toggleThemeVisibility: (themeId: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      hasConsented: false,
      hiddenThemes: [],

      setOnboarded: (value) => set({ isOnboarded: value }),

      setConsent: (value) => set({ hasConsented: value }),

      toggleThemeVisibility: (themeId) =>
        set((state) => ({
          hiddenThemes: state.hiddenThemes.includes(themeId)
            ? state.hiddenThemes.filter((t) => t !== themeId)
            : [...state.hiddenThemes, themeId],
        })),

      reset: () =>
        set({
          isOnboarded: false,
          hasConsented: false,
          hiddenThemes: [],
        }),
    }),
    {
      name: 'character-insights-app',
    }
  )
);
