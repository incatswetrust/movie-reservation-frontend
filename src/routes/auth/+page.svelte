<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { AxiosError, type AxiosResponse } from 'axios';
	import { api } from '../../Module';
	import type { UserLoginDto, UserReadDto, UserRegisterDto } from '../../Api';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		validateUsername,
		validatePassword,
		validatePasswordConfirmation
	} from '$lib/tools/validators';

	const client = useQueryClient();

	let mode = $state<'login' | 'register'>('login');

	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let usernameError = $state('');
	let passwordError = $state('');
	let confirmPasswordError = $state('');

	const redirectParam = $derived($page.url.searchParams.get('redirect') ?? '');

	function switchMode(next: 'login' | 'register') {
		mode = next;
		username = '';
		password = '';
		confirmPassword = '';
		usernameError = '';
		passwordError = '';
		confirmPasswordError = '';
	}

	function validate(): boolean {
		usernameError = mode === 'register' ? validateUsername(username) : username ? '' : 'Username is required';
		passwordError = mode === 'register' ? validatePassword(password) : password ? '' : 'Password is required';
		confirmPasswordError = mode === 'register' ? validatePasswordConfirmation(password, confirmPassword) : '';

		return !usernameError && !passwordError && !confirmPasswordError;
	}

	async function onSuccess(userData: UserReadDto) {
		auth.setUser(userData);
		client.invalidateQueries({ queryKey: ['user'] });
		await goto(redirectParam || '/');
	}

	const loginMutation = createMutation({
		mutationFn: async () => {
			const dto: UserLoginDto = { username, password };
			const response: AxiosResponse<UserReadDto> = await api.auth.authLoginCreate(dto);
			return response.data;
		},
		onSuccess
	});

	const registerMutation = createMutation({
		mutationFn: async () => {
			const dto: UserRegisterDto = { username, password };
			const response: AxiosResponse<UserReadDto> = await api.auth.authRegisterCreate(dto);
			return response.data;
		},
		onSuccess
	});

	function submit() {
		if (!validate()) return;
		if (mode === 'login') {
			$loginMutation.mutate();
		} else {
			$registerMutation.mutate();
		}
	}

	function googleLogin() {
		// Hits the backend directly (bypassing the /api rewrite proxy) so the OAuth
		// correlation cookie is set on the same origin Google redirects back to —
		// through the proxy, the cookie would end up on the frontend's own domain
		// while Google's callback lands on the backend's, breaking correlation.
		window.location.href = 'https://moviereservationsystem.runasp.net/api/Auth/google';
	}

	const activeMutation = $derived(mode === 'login' ? loginMutation : registerMutation);
</script>

<svelte:head>
	<title>{mode === 'login' ? 'Sign In' : 'Sign Up'} — Movie Reservation</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md rounded-2xl border border-accent/15 bg-surface p-8 shadow-lg">
		<div class="mb-6 flex rounded-full bg-primary p-1">
			<button
				type="button"
				class={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
					mode === 'login' ? 'bg-accent text-primary' : 'text-text hover:text-accent'
				}`}
				onclick={() => switchMode('login')}
			>
				Login
			</button>
			<button
				type="button"
				class={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
					mode === 'register' ? 'bg-accent text-primary' : 'text-text hover:text-accent'
				}`}
				onclick={() => switchMode('register')}
			>
				Register
			</button>
		</div>

		<h1 class="mb-1 text-2xl font-bold text-text">
			{mode === 'login' ? 'Welcome back' : 'Create an account'}
		</h1>
		<p class="mb-6 text-sm text-text/60">
			{mode === 'login' ? 'Sign in to manage your bookings' : 'Sign up to start booking tickets'}
		</p>

		{#if $activeMutation.isError}
			<p class="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
				{$activeMutation.error instanceof AxiosError && typeof $activeMutation.error.response?.data === 'string'
					? $activeMutation.error.response.data
					: 'Something went wrong. Please try again.'}
			</p>
		{/if}

		<form
			class="flex flex-col gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<div>
				<label for="username" class="mb-1 block text-sm text-text/80">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					class="w-full rounded-lg border border-accent/20 bg-primary px-3 py-2 text-text outline-none transition-colors focus:border-accent"
				/>
				{#if usernameError}
					<p class="mt-1 text-xs text-red-500">{usernameError}</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm text-text/80">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="w-full rounded-lg border border-accent/20 bg-primary px-3 py-2 text-text outline-none transition-colors focus:border-accent"
				/>
				{#if passwordError}
					<p class="mt-1 text-xs text-red-500">{passwordError}</p>
				{/if}
			</div>

			{#if mode === 'register'}
				<div>
					<label for="confirmPassword" class="mb-1 block text-sm text-text/80">Confirm password</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						class="w-full rounded-lg border border-accent/20 bg-primary px-3 py-2 text-text outline-none transition-colors focus:border-accent"
					/>
					{#if confirmPasswordError}
						<p class="mt-1 text-xs text-red-500">{confirmPasswordError}</p>
					{/if}
				</div>
			{/if}

			<button
				type="submit"
				disabled={$activeMutation.isPending}
				class="mt-2 rounded-full bg-accent px-4 py-2.5 font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{#if $activeMutation.isPending}
					Please wait...
				{:else}
					{mode === 'login' ? 'Sign In' : 'Sign Up'}
				{/if}
			</button>
		</form>

		<div class="my-6 flex items-center gap-3">
			<div class="h-px flex-1 bg-accent/15"></div>
			<span class="text-xs text-text/50">or</span>
			<div class="h-px flex-1 bg-accent/15"></div>
		</div>

		<button
			type="button"
			onclick={googleLogin}
			class="flex w-full items-center justify-center gap-2 rounded-full border border-accent/20 bg-primary px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5">
				<path
					fill="#4285F4"
					d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.41 3.62v3.01h3.9c2.28-2.1 3.56-5.2 3.56-8.82z"
				/>
				<path
					fill="#34A853"
					d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.9-3.01c-1.08.72-2.46 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.28v3.1C3.26 21.3 7.31 24 12 24z"
				/>
				<path
					fill="#FBBC05"
					d="M5.31 14.31c-.25-.72-.38-1.49-.38-2.31s.13-1.59.38-2.31v-3.1H1.28A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.28 5.41z"
				/>
				<path
					fill="#EA4335"
					d="M12 4.75c1.76 0 3.35.61 4.6 1.79l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.59l4.03 3.1c.94-2.82 3.58-4.94 6.69-4.94z"
				/>
			</svg>
			Continue with Google
		</button>

		<p class="mt-6 text-center text-sm text-text/60">
			{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
			<button
				type="button"
				class="font-medium text-accent hover:underline"
				onclick={() => switchMode(mode === 'login' ? 'register' : 'login')}
			>
				{mode === 'login' ? 'Sign up' : 'Sign in'}
			</button>
		</p>
	</div>
</div>
