/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF8F3',
        cream: '#F3ECE1',
        beige: '#E7DCCB',
        wine: '#6E1023',
        'wine-dark': '#520B1A',
        purple: '#4B1E5B',
        plum: '#5A2A4D',
        'plum-soft': '#7A4466',
        gold: '#B08D57',
        'gold-soft': '#C9AD7E',
        'gold-antique': '#9C7B4A',
        charcoal: '#2A2522',
        muted: '#6B6259',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'fade-up-slow': 'fade-up 1s ease-out both',
      },
    },
  },
  plugins: [],
}
