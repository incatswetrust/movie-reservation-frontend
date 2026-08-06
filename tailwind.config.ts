import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',

	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				surface: 'rgb(var(--color-surface) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				text: 'rgb(var(--color-text) / <alpha-value>)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
			}
		}
	},

	plugins: []
} satisfies Config;
