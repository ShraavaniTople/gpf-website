/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        g: {
          bg:       '#05040C',
          deep:     '#080618',
          surface:  '#0D0B1F',
          line:     '#1C1A32',
          purple:   '#7C3AED',
          violet:   '#A78BFA',
          amber:    '#F59E0B',
          gold:     '#FCD34D',
          muted:    '#52506A',
          sub:      '#9490AD',
          text:     '#F0EEF8',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
