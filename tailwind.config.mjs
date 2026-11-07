/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#1D61E0',
          light: '#3B82F6',
          dark: '#154EC1',
          hover: '#1854C4',
        },
        emerald: {
          DEFAULT: '#00B074',
          light: '#10B981',
          dark: '#008F5D',
          hover: '#009E67',
        },
        darkbase: {
          DEFAULT: '#0A0D12',
          surface: '#11161F',
          card: '#161C26',
          border: '#232C3B',
          muted: '#8A99AD',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif'
        ],
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glow-cobalt': '0 0 35px -5px rgba(29, 97, 224, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(0, 176, 116, 0.35)',
      },
      backdropBlur: {
        'apple': '20px',
      }
    },
  },
  plugins: [],
};
