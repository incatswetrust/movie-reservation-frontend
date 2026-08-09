import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth';
import { toast } from '$lib/stores/toast';

/**
 * Route guards for client-side auth checks. This codebase resolves auth state
 * once (see `auth.loadStatus()` in `+layout.svelte`) and checks it client-side
 * from within components/pages via `onMount`, rather than SvelteKit `load`
 * SSR guards. These helpers build on top of the `auth` store instead of
 * re-implementing another `api.auth.authStatusList()` call.
 */

async function waitForAuthReady(): Promise<void> {
	if (!get(auth).isLoading) return;
	await new Promise<void>((resolve) => {
		const unsubscribe = auth.subscribe((state) => {
			if (!state.isLoading) {
				unsubscribe();
				resolve();
			}
		});
	});
}

/**
 * Redirects unauthenticated users to the auth page. Call from `onMount`.
 * Resolves to `true` when the user is authenticated, `false` otherwise
 * (a redirect has already been triggered in that case).
 */
export async function requireAuth(redirectTo = '/auth'): Promise<boolean> {
	await waitForAuthReady();

	if (!get(auth).isAuthenticated) {
		await goto(redirectTo);
		return false;
	}

	return true;
}

/**
 * Redirects non-admin users away from admin-only pages. Call from `onMount`.
 * Resolves to `true` when the user is an admin, `false` otherwise
 * (a redirect has already been triggered in that case).
 */
export async function requireAdmin(redirectTo = '/'): Promise<boolean> {
	await waitForAuthReady();

	const state = get(auth);

	if (!state.isAuthenticated) {
		await goto('/auth');
		return false;
	}

	if (!state.isAdmin) {
		toast.show('Admins only. Redirecting...', 'error');
		await goto(redirectTo);
		return false;
	}

	return true;
}
