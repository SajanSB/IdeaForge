/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "16px",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        border: "var(--border-subtle)",
        input: "var(--border-subtle)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        chrome: {
          DEFAULT: "var(--chrome)",
          elevated: "var(--chrome-elevated)",
          surface: "var(--chrome-surface)",
          border: "var(--chrome-border)",
          muted: "var(--chrome-muted)",
          subtle: "var(--chrome-subtle)",
        },
        elevated: "var(--chrome-surface)",
        danger: "var(--error)",
        paper: {
          DEFAULT: "var(--surface-paper)",
          muted: "var(--surface-paper-muted)",
          ink: "var(--surface-ink)",
          "ink-muted": "var(--surface-ink-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--on-primary)",
          hover: "var(--primary-hover)",
          muted: "var(--primary-muted)",
          end: "var(--primary-end)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--on-secondary)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--on-error)",
        },
        muted: {
          DEFAULT: "var(--surface-container-high)",
          foreground: "var(--on-surface-variant)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          muted: "var(--accent-muted)",
          foreground: "var(--on-primary)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--on-surface)",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--on-surface)",
        },
        agent: {
          ba: "var(--agent-ba)",
          ux: "var(--agent-ux)",
          pe: "var(--agent-pe)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        glow: "0 0 60px rgba(255, 255, 255, 0.04)",
        "glow-lg": "0 0 80px rgba(255, 255, 255, 0.06)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
        browser: "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "ai-spectrum-drift": {
          "0%, 100%": { opacity: "0.3", transform: "translateX(0) scale(1)" },
          "50%": { opacity: "0.45", transform: "translateX(2%) scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 8s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 2s infinite",
        "float-slow": "float 12s ease-in-out 1s infinite",
        shimmer: "shimmer 3s linear infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "ai-spectrum-drift": "ai-spectrum-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
