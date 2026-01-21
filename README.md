# Character Insights - Web PoC

A web-based proof of concept for self-reflection based on 12 character themes to support personal growth. Built with React + TypeScript + Vite.

**Live Demo:** https://forapp.deven.site

**GitHub:** https://github.com/devenspear/for-app-proto-1.0

## Overview

Character Insights helps users track and reflect on 12 character themes (based on AA-adjacent character defects):
- Pride, Greed, Lust, Anger, Gluttony, Envy
- Sloth, Fear, Self-Pity, Guilt, Shame, Dishonesty

The app calculates weekly scores (0-10) based on:
- Manual data entry (app usage, behavior metrics, health data)
- Daily self-report check-ins (mood, primary theme, journal)
- Heuristic scoring algorithms per theme

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 (with inline styles for contrast)
- **State Management:** Zustand
- **Local Storage:** Dexie.js (IndexedDB wrapper)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Dates:** date-fns
- **Routing:** React Router DOM v7
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/
│   └── App.tsx                    # Root component with routing
├── pages/
│   ├── Onboarding.tsx             # Welcome + consent flow (4 steps)
│   ├── Dashboard.tsx              # Weekly scores view with bar chart
│   ├── DailyCheckIn.tsx           # Mood + theme + journal entry
│   ├── DataEntry.tsx              # Manual usage data input (sliders)
│   └── Settings.tsx               # Theme visibility + data management
├── components/
│   ├── common/
│   │   ├── Button.tsx             # Primary button component (inline styles)
│   │   ├── Card.tsx               # Card wrapper component
│   │   ├── Layout.tsx             # App shell with header + bottom nav
│   │   └── Modal.tsx              # Bottom sheet modal
│   ├── charts/
│   │   └── WeeklyBarChart.tsx     # 12-theme bar chart (Recharts)
│   └── dashboard/
│       ├── ThemeCard.tsx          # Individual theme score display
│       ├── WeekSelector.tsx       # Week navigation
│       ├── InsightsSummary.tsx    # Highlights + prompts
│       └── ThemeDetailModal.tsx   # Score breakdown modal
├── services/
│   ├── scoring/
│   │   ├── ScoringEngine.ts       # Main scoring orchestrator
│   │   ├── FeatureExtractor.ts    # Extract features from data
│   │   └── themes/index.ts        # Per-theme scoring logic
│   └── storage/
│       ├── db.ts                  # Dexie.js database setup
│       └── mockData.ts            # Demo/seed data generator
├── store/
│   ├── useAppStore.ts             # App state (onboarding, settings)
│   └── useDataStore.ts            # Usage data + check-ins + scores
├── types/
│   ├── Theme.ts                   # CharacterTheme enum
│   ├── Score.ts                   # ThemeScore, WeeklyReport types
│   ├── CheckIn.ts                 # DailyCheckIn type
│   └── UsageData.ts               # DailyUsageEntry type
├── constants/
│   ├── themes.ts                  # Theme definitions, colors, prompts
│   └── scoring.ts                 # Weights and thresholds
└── utils/
    └── dates.ts                   # Date helpers (getToday, formatDate, etc.)
```

## Data Models

### DailyUsageEntry
```typescript
interface DailyUsageEntry {
  id?: number;
  date: string;                    // YYYY-MM-DD
  socialMediaMinutes: number;
  shoppingMinutes: number;
  entertainmentMinutes: number;
  datingAppsMinutes: number;
  productivityMinutes: number;
  newsMinutes: number;
  gamesMinutes: number;
  phonePickups: number;
  lateNightUsageMinutes: number;
  steps: number;
  sleepHours: number;
  wakeTime: string;                // HH:mm
  createdAt: number;
}
```

### DailyCheckIn
```typescript
interface DailyCheckIn {
  id?: number;
  date: string;                    // YYYY-MM-DD
  moodScore: number;               // 1-10
  primaryTheme: CharacterTheme;
  journalEntry?: string;
  createdAt: number;
}
```

### ThemeScore
```typescript
interface ThemeScore {
  theme: CharacterTheme;
  score: number;                   // 0-10
  confidence: number;              // 0-1
  trend: 'up' | 'down' | 'stable';
  signalBreakdown: SignalContribution[];
}
```

## Scoring Logic

Each theme maps to specific signals with configurable weights:

| Theme | Primary Signals | Data Sources |
|-------|----------------|--------------|
| Pride | Social media time, self-presentation | 40% social, 30% data, 30% self-report |
| Greed | Shopping time, finance apps | 50% shopping, 20% data, 30% self-report |
| Sloth | Low steps, high passive time, late wake | 30% steps, 30% screen, 20% sleep, 20% self-report |
| Gluttony | Entertainment + late night usage | 40% entertainment, 30% late night, 30% self-report |
| Envy | Social media + repeated sessions | 50% social, 20% pickups, 30% self-report |
| Lust | Dating apps time | 40% dating, 30% data, 30% self-report |
| Fear/Anger/etc. | Primarily self-report | 80-100% self-report |

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The app auto-deploys to Vercel on push to `main` branch.

```bash
# Manual deployment
vercel --prod

# Update custom domain alias
vercel alias set <deployment-url> forapp.deven.site
```

## Key Features

### Implemented
- [x] Onboarding flow (4 steps: welcome, privacy, consent, demo data)
- [x] Daily check-in (mood 1-10, theme picker, journal)
- [x] Data entry (7 app categories, behavior metrics, health data)
- [x] Dashboard with weekly bar chart
- [x] Theme detail modal with score breakdown
- [x] Week navigation (prev/next week)
- [x] Theme visibility toggles
- [x] Demo data generation (2 weeks)
- [x] Data export (JSON)
- [x] Clear data / Reset app
- [x] Check-in streak tracking
- [x] Local storage persistence (IndexedDB)

### Future Enhancements
- [ ] Trend visualization (week-over-week line charts)
- [ ] Custom reflective prompts based on scores
- [ ] Data import from JSON
- [ ] PWA support (offline, install prompt)
- [ ] Dark mode
- [ ] Notifications/reminders
- [ ] Export to PDF report
- [ ] Integration with health APIs (Apple Health, Google Fit)

## Styling Notes

**Important:** Tailwind CSS v4 custom color classes (e.g., `text-primary-500`) don't work reliably in this setup. All critical UI elements use **inline styles** with direct hex color values for guaranteed visibility:

- Primary: `#4f46e5` (indigo-600)
- Text dark: `#18181b` (neutral-900)
- Text medium: `#52525b` (neutral-600)
- Text light: `#71717a` (neutral-500)
- Success: `#059669` (emerald-600)
- Danger: `#dc2626` (red-600)

## Environment

- Node.js 18+
- npm 9+
- Vercel CLI (for deployment)

## License

Private - For App Prototype 1.0
