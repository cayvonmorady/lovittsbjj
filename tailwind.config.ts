import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Tiny Kids (green)
    'border-green-500',
    'bg-green-500/20',
    'text-green-500',
    // Kids (blue)
    'border-blue-500',
    'bg-blue-500/20',
    'text-blue-500',
    // Adults (purple)
    'border-purple-500',
    'bg-purple-500/20',
    'text-purple-500',
    // Women's (pink)
    'border-pink-500',
    'bg-pink-500/20',
    'text-pink-500',
    // Uniform types
    'border-cyan-500',
    'bg-cyan-500/20',
    'text-cyan-500',
    'border-yellow-500',
    'bg-yellow-500/20',
    'text-yellow-500',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
