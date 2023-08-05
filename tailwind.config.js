/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--main-color)",
        "secondary-color": "var(--secondary-color)",
        "tertiary-color": "var(--tertiary-color)",
        "bg-color": "var(--bg-color)"
      },
    },
  },
  plugins: [],
};
