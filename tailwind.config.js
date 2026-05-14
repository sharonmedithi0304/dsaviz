/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        app: { bg: '#0A0C10', nav: '#060810', bar: '#0A0C10' },
        code: { bg: '#0F1117' },
        viz: { bg: '#0D1117' },
        node: {
          default: '#1E2235',
          active: '#3B82F6',
          visited: '#22C55E',
          comparing: '#F59E0B',
          swapping: '#EF4444',
          new: '#A855F7',
        },
        purpose: { bg: '#111827', border: '#1E40AF' },
        line: { active: '#1C3A5E' },
      },
    },
  },
  plugins: [],
};
