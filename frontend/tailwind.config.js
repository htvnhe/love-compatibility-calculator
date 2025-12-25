/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          50: '#fff0f3',
          100: '#ffe0e7',
          200: '#ffc6d3',
          300: '#ff9db3',
          400: '#ff6b8a',
          500: '#ff3366',
          600: '#ed1152',
          700: '#c80844',
          800: '#a60a3f',
          900: '#8c0d3c',
        },
        romantic: {
          pink: '#FF6B9D',
          purple: '#C44DFF',
          blue: '#4D79FF',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'love-gradient': 'linear-gradient(135deg, #FF6B9D 0%, #C44DFF 50%, #4D79FF 100%)',
      }
    },
  },
  plugins: [],
}
