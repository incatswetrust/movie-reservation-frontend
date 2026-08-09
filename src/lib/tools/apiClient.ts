import type { AxiosError, AxiosRequestConfig } from 'axios';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { Api } from '../../Api';
import { auth } from '$lib/stores/auth';

interface RetriableConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const SKIP_REFRESH_PATHS = ['/api/Auth/login', '/api/Auth/register', '/api/Auth/refresh'];

/**
 * Wires a 401 interceptor onto the shared API client: refresh the access token once
 * and retry the original request, falling back to a redirect to /auth if the refresh
 * itself fails. `/api/Auth/status` is exempt from the redirect since it's used to
 * passively probe session state on app load — `auth.loadStatus()` already handles
 * that failure silently.
 */
export function setupApiClient(api: Api<unknown>) {
	let refreshPromise: Promise<boolean> | null = null;

	api.instance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as RetriableConfig | undefined;
			const url = originalRequest?.url ?? '';

			if (
				error.response?.status !== 401 ||
				!originalRequest ||
				originalRequest._retry ||
				SKIP_REFRESH_PATHS.some((path) => url.includes(path))
			) {
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			if (!refreshPromise) {
				refreshPromise = api.auth
					.authRefreshCreate()
					.then(() => true)
					.catch(() => false)
					.finally(() => {
						refreshPromise = null;
					});
			}

			const refreshed = await refreshPromise;
			if (refreshed) {
				return api.instance.request(originalRequest);
			}

			auth.clear();
			if (browser && !url.includes('/api/Auth/status')) {
				await goto('/auth');
			}

			return Promise.reject(error);
		}
	);
}
