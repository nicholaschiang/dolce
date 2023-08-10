const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      sans: [
        'Inter',
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
      serif: ['Bodoni Moda', 'serif'],
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
      aspectRatio: {
        person: '9 / 16',
      },
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
        '1.25': '0.3125rem',
        '6.5': '1.625rem',
        '5/4': '125%',
      },
      keyframes: {
        // Tooltip (tailwindcss-radix)
        'slide-up-fade': {
          '0%': { opacity: 0, transform: 'translateY(2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-right-fade': {
          '0%': { opacity: 0, transform: 'translateX(-2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'slide-down-fade': {
          '0%': { opacity: 0, transform: 'translateY(-2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-left-fade': {
          '0%': { opacity: 0, transform: 'translateX(2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        // Accordion (shadcn-ui)
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        // Loading (cmdk)
        // @see {@link https://github.com/pacocoursey/cmdk/blob/main/website/styles/cmdk/raycast.scss#L348}
        'load': {
          '0%': { opacity: 0, transform: 'translateX(0)' },
          '50%': { opacity: 1, transform: 'translateX(100%)' },
          '100%': { opacity: 0, transform: 'translateX(0)' },
        },
        // Fade (gradually fade component in on mount)
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        // Tooltip (tailwindcss-radix)
        'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right-fade':
          'slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down-fade': 'slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left-fade': 'slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        // Accordion (shadcn-ui)
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Loading (cmdk)
        'load': 'load 1.5s ease infinite',
        'shine': 'load 1.5s ease',
        // Fade (gradually fade component in on mount)
        'fade-in': 'fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-radix'),
    require('@tailwindcss/typography'),
  ],
}
