/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forensic: {
          950: '#070b10',
          900: '#0c121b',
          850: '#101824',
          800: '#16202f',
          750: '#1b273a',
          700: '#22324a',
          600: '#324765',
          500: '#476288',
          border: '#1f2e43',
          'border-light': '#2c3f5b',
          cyan: '#00e5ff',
          blue: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(0, 229, 255, 0.25)',
        'glow-crimson': '0 0 15px -3px rgba(239, 68, 68, 0.3)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
