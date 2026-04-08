const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          light: 'var(--color-primary-light)',
        },
        card: 'var(--color-card)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          strong: 'var(--color-surface-strong)',
        },
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        danger: {
          DEFAULT: 'var(--color-danger)',
          light: 'var(--color-danger-light)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
        },
        ring: 'var(--color-ring)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        18: '4.5rem',
        30: '7.5rem',
      },
      fontFamily: {
        body: ['System'],
        display: ['System'],
      },
    },
  },
};
