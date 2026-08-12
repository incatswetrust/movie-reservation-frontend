import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',

	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				// Surfaces
				app: 'rgb(var(--bg-app) / <alpha-value>)',
				surface: 'rgb(var(--bg-surface) / <alpha-value>)',
				'surface-secondary': 'rgb(var(--bg-surface-secondary) / <alpha-value>)',
				elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',

				// Text
				ink: 'rgb(var(--text-primary) / <alpha-value>)',
				'ink-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
				'ink-muted': 'rgb(var(--text-muted) / <alpha-value>)',
				'ink-disabled': 'rgb(var(--text-disabled) / <alpha-value>)',
				'on-accent': 'rgb(var(--text-on-accent) / <alpha-value>)',

				// Brand
				'brand-red': 'rgb(var(--brand-red) / <alpha-value>)',
				'brand-gold': 'rgb(var(--brand-gold) / <alpha-value>)',
				'brand-charcoal': 'rgb(var(--brand-charcoal) / <alpha-value>)',

				// Legacy aliases kept during redesign migration
				primary: 'rgb(var(--bg-app) / <alpha-value>)',
				accent: 'rgb(var(--brand-gold) / <alpha-value>)',
				text: 'rgb(var(--text-primary) / <alpha-value>)'
			},
			borderColor: {
				DEFAULT: 'var(--border-default)',
				subtle: 'var(--border-subtle)',
				strong: 'var(--border-strong)'
			},
			boxShadow: {
				soft: 'var(--shadow-soft)',
				card: 'var(--shadow-card)',
				floating: 'var(--shadow-floating)'
			},
			borderRadius: {
				xs: '8px',
				sm: '12px',
				md: '16px',
				lg: '20px',
				xl: '28px'
			},
			transitionDuration: {
				fast: '120ms',
				normal: '180ms',
				slow: '260ms'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
			}
		}
	},

	plugins: []
} satisfies Config;
