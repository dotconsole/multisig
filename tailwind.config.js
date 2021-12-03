const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionDuration: {},
      fontSize: {},
      height: {
        'full-page': 'calc(100vh - 72px)'
      },
      maxHeight: {},
      screens: {
        widetab: '1169px',
        desktop: '1440px',
      },
      minWidth: {},
      minHeight: {},
      maxWidth: {},
      width: {},
      opacity: {},
      borderRadius: {},
      colors: {},
      zIndex: {},
      inset: {},
    },
  },
  variants: {},
  plugins: [],
};