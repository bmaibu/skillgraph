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
        brand: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d6fe',
          300: '#a4bcfd',
          400: '#7a97f9',
          500: '#536df2',
          600: '#3d4ee6',
          700: '#303ccf',
          800: '#2a33a8',
          900: '#272f85',
          950: '#0b0f19',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#111827',
          850: '#0f172a',
          900: '#0b0f19',
          950: '#030712'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
