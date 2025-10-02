/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4BA3A8',
        accent: '#DE925B',
        text: '#111111',
        background: '#E5E7DF'
      }
    },
  },
  plugins: [],
}