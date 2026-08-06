import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
	if (!browser) return 'dark';

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;

	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(value: Theme) {
	if (!browser) return;

	document.documentElement.classList.toggle('dark', value === 'dark');
	localStorage.setItem(STORAGE_KEY, value);
}

function createThemeStore() {
	const initial = getInitialTheme();
	applyTheme(initial);

	const { subscribe, update } = writable<Theme>(initial);

	return {
		subscribe,
		set(value: Theme) {
			applyTheme(value);
			update(() => value);
		},
		toggle() {
			update((current) => {
				const next: Theme = current === 'dark' ? 'light' : 'dark';
				applyTheme(next);
				return next;
			});
		}
	};
}

export const theme = createThemeStore();
