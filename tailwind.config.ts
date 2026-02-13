import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Tiny Kids (blue)
    "border-blue-500",
    "bg-blue-500/20",
    "text-blue-500",
    // Kids (green)
    "border-green-500",
    "bg-green-500/20",
    "text-green-500",
    // Adults (purple)
    "border-purple-500",
    "bg-purple-500/20",
    "text-purple-500",
    // Women's (red)
    "border-red-500",
    "bg-red-500/20",
    "text-red-500",
    // Muay Thai (orange)
    "border-orange-500",
    "bg-orange-500/20",
    "text-orange-500",
    // Gi (cyan)
    "border-cyan-500",
    "bg-cyan-500/20",
    "text-cyan-500",
    // No Gi (yellow)
    "border-yellow-500",
    "bg-yellow-500/20",
    "text-yellow-500",
    // No Uniform (gray)
    "border-gray-400",
    "bg-gray-400/20",
    "text-gray-400",
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
