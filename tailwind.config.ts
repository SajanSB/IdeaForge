import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        'amber-primary': '#BA7517',
        'amber-tint':    '#FAEEDA',
        'amber-border':  '#EF9F27',
        'ink':           '#0F0F0F',
        'paper':         '#F7F5F0',
        'slate':         '#6B7280',
        'surface-dark':  '#1A1917',
        'ba-fill':   '#EEEDFE',
        'ba-border': '#AFA9EC',
        'ba-text':   '#3C3489',
        'ux-fill':   '#E1F5EE',
        'ux-border': '#5DCAA5',
        'ux-text':   '#085041',
        'pe-fill':   '#FAEEDA',
        'pe-border': '#EF9F27',
        'pe-text':   '#633806',
      },
      borderWidth: { '0.5': '0.5px', '1.5': '1.5px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
