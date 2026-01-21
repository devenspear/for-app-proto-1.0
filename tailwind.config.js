/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Neutral palette
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Primary brand color - refined indigo
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Theme colors - refined, professional palette
        theme: {
          pride: { DEFAULT: '#7c3aed', light: '#ede9fe', dark: '#5b21b6' },
          greed: { DEFAULT: '#d97706', light: '#fef3c7', dark: '#b45309' },
          lust: { DEFAULT: '#db2777', light: '#fce7f3', dark: '#be185d' },
          anger: { DEFAULT: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
          gluttony: { DEFAULT: '#ea580c', light: '#ffedd5', dark: '#c2410c' },
          envy: { DEFAULT: '#059669', light: '#d1fae5', dark: '#047857' },
          sloth: { DEFAULT: '#6b7280', light: '#f3f4f6', dark: '#4b5563' },
          fear: { DEFAULT: '#2563eb', light: '#dbeafe', dark: '#1d4ed8' },
          selfPity: { DEFAULT: '#0891b2', light: '#cffafe', dark: '#0e7490' },
          guilt: { DEFAULT: '#7c3aed', light: '#ede9fe', dark: '#6d28d9' },
          shame: { DEFAULT: '#c026d3', light: '#fae8ff', dark: '#a21caf' },
          dishonesty: { DEFAULT: '#475569', light: '#f1f5f9', dark: '#334155' },
        },
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'soft': '0 2px 8px -2px rgb(0 0 0 / 0.08), 0 4px 16px -4px rgb(0 0 0 / 0.06)',
        'medium': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 8px 24px -4px rgb(0 0 0 / 0.1)',
        'large': '0 8px 24px -4px rgb(0 0 0 / 0.1), 0 16px 48px -8px rgb(0 0 0 / 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
