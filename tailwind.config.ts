import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{svelte,ts,js}'],
  theme: {
    extend: {
      colors: {
        brand:{
          yellow: '#f5e804',
          green: '#14814A',
          lightGreen: '#76a84a',
          yellowGreen: '#8ebd3d',
          blue: '#005691',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#005691',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#8ebd3d',
          600: '#76a84a',
          700: '#14814A'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#f5e804'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
} satisfies Config;
