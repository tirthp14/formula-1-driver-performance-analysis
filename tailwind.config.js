/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        mainBackground: "#14141d",
      },
      fontFamily: {
        main: ['Titillium Web', 'sans-serif']
      }
    },
  },
  plugins: [],
}

