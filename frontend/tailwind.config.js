/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {},
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
    },
    colors: {
        transparent: 'transparent',
        danger: "#FF0000",
        light: "#4AE3CB",
        regular: "#2B9BA2",
        dark: "#00003A",
        darkblue: "#000054",
        black: "#000000"
    },
  },
  plugins: []
  }