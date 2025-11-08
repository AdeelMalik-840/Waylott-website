import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F7F4',
          100: '#E6EFEA',
          600: '#1E5A3D', // primary
        },
        accent: { 500: '#C7A100' }, // soft gold
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.06)',
        hover: '0 10px 30px -8px rgba(0,0,0,.20)',
      },
    },
  },
  plugins: [],
}

export default config



