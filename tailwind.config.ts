import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    '#0A1628',
        navy2:   '#0D2044',
        navy3:   '#06101E',
        green:   '#00E676',
        green2:  '#00C853',
        forest:  '#00796B',
        silver:  '#B0BEC5',
        silver2: '#CFD8DC',
        silver3: '#E0EAF0',
        slate:   '#546E7A',
        muted:   '#37474F',
      },
      fontFamily: {
        rajdhani: ['var(--font-rajdhani)', 'Arial Black', 'sans-serif'],
        exo:      ['var(--font-exo)', 'Arial', 'sans-serif'],
        mono:     ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00E676 0%, #CFD8DC 45%, #78909C 100%)',
        'navy-gradient':  'linear-gradient(180deg, #0D2044 0%, #06101E 100%)',
        'card-gradient':  'linear-gradient(145deg, #0D1F3A, #0A1A30)',
        'hero-radial':    'radial-gradient(ellipse at 20% 50%, rgba(0,230,118,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,100,255,0.05) 0%, transparent 40%)',
      },
      boxShadow: {
        'green-glow': '0 0 30px rgba(0,230,118,0.15)',
        'card':       '0 4px 24px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'fade-in':    'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
