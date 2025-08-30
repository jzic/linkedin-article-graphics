/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // EQUIAM Brand Colors from design system
        primary: {
          50: '#E3ECFF',
          100: '#C3D3F4',
          200: '#8FA7E1',
          300: '#8FA7E1',
          400: '#609bfd',
          500: '#3B5BA9',
          600: '#1464e9', // Main brand blue
          700: '#1A2352',
          800: '#0F1538',
          900: '#0A0E27',
        },
        accent: {
          neon: '#00FF94', // Success/growth
          gold: '#FFD700', // Premium
          alert: '#FF3366', // Risk
          purple: '#7C3AED', // Data viz
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        display: ['PP Neue Montreal', '-apple-system', 'sans-serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}