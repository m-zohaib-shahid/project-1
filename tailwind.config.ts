import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        // Claymorphism shadows with soft multi-colored opacity tints
        'clay-card': '6px 6px 14px rgba(163, 177, 198, 0.5), -6px -6px 14px rgba(255, 255, 255, 0.7)',
        'clay-card-dark': '6px 6px 16px rgba(0, 0, 0, 0.6), -6px -6px 16px rgba(30, 41, 59, 0.8)',
        'clay-button': '4px 4px 10px rgba(163, 177, 198, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.8)',
        'clay-input': '2px 2px 6px rgba(163, 177, 198, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.9)',
        'clai-sm': '2px 2px 5px rgba(163, 177, 198, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.8)',
        'clay-lg': '8px 8px 20px rgba(163, 177, 198, 0.3), -8px -8px 20px rgba(255, 255, 255, 0.6)',

        // Focus ring shadows
        'focus-ring': '0 0 0 3px rgba(59, 130, 246, 0.4)',
        'focus-ring-muted': '0 0 0 3px rgba(100, 116, 139, 0.2)',

        // Inner inset shadows for pressed state
        'clay-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;