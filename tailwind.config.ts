import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors based on v2.0 guidelines
        "brand-blue": "#00A9E0", // Azure Radiance - Main Brand Color
        "brand-coral": "#FF6B6B", // Sunset Coral - Action & Stamps
        "brand-yellow": "#FFD60A", // Highlight Gold - Emphasis & Badges
        "brand-green": "#2E7D32", // Forest Green - Secondary Accent
        "brand-sand": "#F5F5F7", // Light Gray - Background & Cards
        "brand-white": "#FFFFFF", // Snow White - Default Background
        "brand-cloud": "#F5F5F7", // Light Gray - Alternative Background
        "brand-navy": "#1D1D1F", // Primary Text - Premium & Text
        "brand-gray": "#8E8E93", // Secondary Text - Secondary Text
        "brand-success": "#34C759", // Success Green
        "brand-alert": "#FF3B30", // Alert Red

        // Legacy colors (kept for backward compatibility)
        "sky-blue": "#00A9E0", // Updated to Azure Radiance
        "sunset-coral": "#FF6B6B", // Updated to Sunset Coral
        "cloud-white": "#F5F5F7", // Updated to Light Gray
        "sunshine-yellow": "#FFD60A", // Updated to Highlight Gold
        "light-sand": "#F5F5F7", // Updated to Light Gray
        "deep-navy": "#1D1D1F", // Updated to Primary Text
        "stone-gray": "#8E8E93", // Updated to Secondary Text
        "forest-green": "#2E7D32", // Added Forest Green
        "highlight-gold": "#FFD60A", // Added Highlight Gold
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "stamp-thunk": {
          "0%": {
            transform: "translateY(-50px) rotate(-5deg)",
            opacity: "0",
          },
          "30%": {
            transform: "translateY(5px) rotate(0deg)",
            opacity: "1",
          },
          "40%": {
            transform: "translateY(-2px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(0) rotate(0deg)",
          },
          "60%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px 2px rgba(255, 107, 107, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 25px 5px rgba(255, 107, 107, 0.6)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "stamp-thunk": "stamp-thunk 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
