/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        mainBackground: "#121212",
        lineBackground: "#191923"
      },
      fontFamily: {
        main: ['Titillium Web', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        fadeInUp: 'fadeInUp 1s ease-in-out',
        bounceIn: 'bounceIn 0.8s ease-in-out',
      }
    },
  },
  plugins: [],
}

