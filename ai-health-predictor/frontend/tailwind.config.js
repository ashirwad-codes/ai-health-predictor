/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode toggling
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#10b981",
      }
    },
  },
  plugins: [],
}
