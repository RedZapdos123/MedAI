/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#dc2626',
          'red-hover': '#b91c1c',
          blue: '#2563eb',
          'blue-hover': '#1d4ed8'
        }
      }
    },
  },
  plugins: [],
}
