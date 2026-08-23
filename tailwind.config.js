/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0B0B0D',
        char: '#151517',
        char2: '#1D1D21',
        line: 'rgba(255,255,255,0.09)',
        genesis: {
          DEFAULT: '#FF6501',
          ember: '#C24E00',
          glow: '#FFA149',
          pale: '#FFD9AD',
        },
        bone: '#F7F5F1',
        paper: '#FAF9F6',
        ink: '#141416',
        steel: '#9A9AA2',
        steel2: '#5C5C64',
      },
      fontFamily: {
        display: ['"Teko"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(rgba(255,101,1,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,101,1,0.08) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,101,1,0.18), transparent 70%)',
      },
      backgroundSize: {
        grid: '38px 38px',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255,101,1,0.25)',
      },
    },
  },
  plugins: [],
}
