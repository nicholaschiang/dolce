const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    fontFamily: {
      sans: [
        'UniversTE20T',
        'UnicodeT',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      mono: [
        'Hack',
        'Menlo',
        'Monaco',
        'Lucida Console',
        'Liberation Mono',
        'DejaVu Sans Mono',
        'Bitstream Vera Sans Mono',
        'Courier New',
        'monospace',
      ],
    },
    extend: {
      fontSize: {
        'xs': ['0.8125rem', '1.0625rem'],
        '2xs': ['0.75rem', '1rem'],
        '3xs': ['0.6875rem', '0.75625rem'],
      },
      borderRadius: {
        sm: '0.1875rem',
        xs: '0.125rem',
      },
      maxWidth: { '2xs': '6.25rem' },
      colors: { gray: colors.zinc },
      spacing: {
        '6.5': '1.625rem',
        '5/4': '125%',
      },
    },
  },
  plugins: [],
};
