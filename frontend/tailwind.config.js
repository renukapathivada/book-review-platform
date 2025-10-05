/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensure Inter is available or remove this if you rely on system font
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
