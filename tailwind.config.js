/**** @type {import('tailwindcss').Config} ****/
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9efff',
          200: '#cedbff',
          300: '#a5beff',
          400: '#7795ff',
          500: '#4f6dff',
          600: '#3549e6',
          700: '#2837b4',
          800: '#212d8a',
          900: '#1e296e'
        }
      }
    },
  },
  plugins: [],
};
