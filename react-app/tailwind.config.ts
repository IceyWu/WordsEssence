import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-gray-900': '#263238',
        'blue-gray-500': '#607d8b',
      },
    },
  },
  plugins: [],
} satisfies Config