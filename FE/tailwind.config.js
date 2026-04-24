/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1f2937',
          900: '#0f172a',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        float: '0 20px 60px rgba(15, 23, 42, 0.12)',
        ring: '0 0 0 6px rgba(59, 130, 246, 0.12)',
      },
      backgroundImage: {
        'page-gradient':
          'radial-gradient(1200px 600px at 20% 0%, rgba(59, 130, 246, 0.14), transparent 55%), radial-gradient(1000px 700px at 90% 10%, rgba(16, 185, 129, 0.10), transparent 50%), linear-gradient(to bottom, #f8fafc, #ffffff)',
      },
    },
  },
  plugins: [],
}