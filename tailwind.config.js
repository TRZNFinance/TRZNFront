/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      'mono': ['ShareTechMono'],
      'post': ['PostNoBills'],
    },
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.non-select': {
          'user-select': 'none',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },

  ],
}

