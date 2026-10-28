/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          bg: '#F5F4F0',
          panel: '#FFFFFF',
          stone: '#EAE8E1',
          border: '#D4D1C7',
          charcoal: '#16202A',
          slate: '#1E293B',
          green: '#14532D',
          emerald: '#15803D',
          emeraldBg: '#DCFCE7',
          amber: '#B45309',
          amberBg: '#FEF3C7',
          crimson: '#B91C1C',
          crimsonBg: '#FEE2E2',
          saffron: '#D97706',
          greensheet: '#EBF5EE',
          noteBorder: '#B7D5C4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
