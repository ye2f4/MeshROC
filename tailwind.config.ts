import type { Config } from 'tailwindcss';

export default {
  corePlugins: {
    preflight: false,
    container: false,
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './static/**/*.html',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        sidebar: '1000px',
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--surface-alt))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--btn-primary))',
          foreground: 'hsl(var(--btn-primary-foreground))',
          hover: 'hsl(var(--btn-primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--surface-alt))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        brand: {
          orange: 'hsl(var(--brand-orange))',
          'orange-foreground': 'hsl(var(--brand-orange-foreground))',
        },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          foreground: 'hsl(var(--surface-foreground))',
        },
        overlay: 'hsl(var(--overlay))',
        subtle: 'hsl(var(--subtle))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
