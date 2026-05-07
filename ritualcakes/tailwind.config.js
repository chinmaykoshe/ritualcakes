
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
      colors: {
        bakery: {
          cream: '#FDF8F5',
          pink: '#FCE7E9',
          rose: '#E5989B',
          chocolate: '#48250B',
          gold: '#D4AF37',
          dark: '#2D1606',
        },
        customGray: 'rgb(77, 77, 77)',
        darkcustomGray: 'rgb(44, 44, 44)',
        darkcustombg: 'rgb(255, 228, 208)',
        darkcustombg1: 'rgb(72, 37, 11)',
        darkcustombg2: 'rgb(255, 192, 143)',
        darkcustombg3: 'rgb(255, 170, 105)',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -10px rgba(72, 37, 11, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}