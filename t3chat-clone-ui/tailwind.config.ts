import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        accent: {
          purple: 'var(--color-accent-purple)',
          pink: 'var(--color-accent-pink)',
          hover: 'var(--color-accent-hover)',
          warning: 'var(--color-accent-warning)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-in': 'slideIn 300ms cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config