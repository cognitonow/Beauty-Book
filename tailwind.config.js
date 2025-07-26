/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}", // Change this line
    "./index.css",
    "./tailwind-safelist.html"
  ],
  
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1a202c', // Add a custom color
      },
    },
  },
  plugins: [],
};
