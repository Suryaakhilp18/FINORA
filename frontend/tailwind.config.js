/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finora: {
          bg: '#050811',
          surface: 'rgba(15, 23, 42, 0.65)',
          card: 'rgba(22, 32, 51, 0.55)',
          cardHover: 'rgba(30, 41, 59, 0.7)',
          border: 'rgba(255, 255, 255, 0.12)',
          accent: '#10B981', // emerald
          accentHover: '#059669',
          brand: '#6366F1', // indigo
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
          muted: '#94A3B8',
          text: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(16, 185, 129, 0.3)',
        'brand-glow': '0 0 40px -5px rgba(99, 102, 241, 0.4)',
        'glass-card': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-hover': '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.25), inset 0 1px 2px 0 rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}
