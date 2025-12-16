/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Re-mapping Indigo to Coral for the Secondary Theme Color
        // This ensures all existing components using 'indigo' classes now appear as Coral
        indigo: {
          50: '#fff0eb',  // Very light coral background
          100: '#ffe3d9',
          200: '#ffc6b3',
          300: '#ff9e80',
          400: '#ff7f50', // Classic Coral
          500: '#f76736', // Vibrant Coral
          600: '#db4e20', // Deep Coral (Good for Text readability)
          700: '#b53a17',
          800: '#923018',
          900: '#762a18',
          950: '#421309',
        }
      }
    },
  },
  plugins: [],
}