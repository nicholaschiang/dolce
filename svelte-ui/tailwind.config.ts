import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
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
