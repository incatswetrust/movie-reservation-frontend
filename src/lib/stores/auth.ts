import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { api } from '../../Module';
import { UserRole, type UserReadDto } from '../../Api';

export interface AuthState {
	user: UserReadDto | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isLoading: boolean;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isAdmin: false,
	isLoading: true
};

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>(initialState);

	function setUser(user: UserReadDto) {
		set({
			user,
			isAuthenticated: true,
			isAdmin: user.role === UserRole.Value1,
			isLoading: false
		});
	}

	function clear() {
		set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
	}

	async function loadStatus() {
		if (!browser) return;
		try {
			const response = await api.auth.authStatusList();
			setUser(response.data);
		} catch {
			clear();
		}
	}

	return { subscribe, loadStatus, setUser, clear };
}

export const auth = createAuthStore();
