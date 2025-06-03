/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#121212',
          elevated: '#181818',
          highlight: '#282828',
          press: '#000000'
        },
        text: {
          base: '#FFFFFF',
          subdued: '#A7A7A7',
          muted: '#727272'
        },
        essential: {
          bright: '#FFFFFF',
          negative: '#F15E6C',
          warning: '#E9B10A',
          positive: '#1ED760',
          announcement: '#3D91F4'
        },
        spotify: {
          green: '#1DB954',
          greenHover: '#1ED760',
          black: '#191414'
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }
    },
  },
  plugins: [],
};