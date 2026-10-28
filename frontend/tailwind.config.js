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
        gov: {
          navy: '#0a192f',
          dark: '#030712',
          saffron: '#ff9933',
          green: '#138808',
          ashoka: '#000080',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(51, 65, 85, 0.5)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
