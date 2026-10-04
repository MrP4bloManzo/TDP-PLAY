import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: '#07110c',
          900: '#0d1b13',
          800: '#12261a',
          700: '#173823',
        },
        accent: {
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 32px rgba(34,197,94,.18)',
      },
    },
  },
  plugins: [],
};

export default config;
