import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
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
      colors: { gray: colors.zinc },
      aspectRatio: {
        person: "9 / 16",
        product: "4 / 5",
      },
    },
  },

  plugins: [forms, typography],
} satisfies Config
