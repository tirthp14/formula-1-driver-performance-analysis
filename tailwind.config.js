/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        lightframe: {
          '0%': { backgroundColor: '#4b5563' },
          '100%': { backgroundColor: '#dc2626' },
        },
      },
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
        light1: 'lightframe 0.1s ease-in-out 1s forwards',
        light2: 'lightframe 0.1s ease-in-out 2s forwards',
        light3: 'lightframe 0.1s ease-in-out 3s forwards',
        light4: 'lightframe 0.1s ease-in-out 4s forwards',
        light5: 'lightframe 0.1s ease-in-out 5s forwards',
      }
    },
  },
  plugins: [],
}

