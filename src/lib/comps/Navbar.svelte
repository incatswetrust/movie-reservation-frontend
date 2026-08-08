<script lang="ts">
	import { UserRole, type UserReadDto } from '../../Api';
	import type { AxiosResponse } from 'axios';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { api } from '../../Module';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import ThemeToggle from './ThemeToggle.svelte';

	const client = useQueryClient();

	const user = createQuery<UserReadDto>({
		queryKey: ['user'],
		queryFn: async () => {
			const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
			return response.data;
		}
	});

	const logoutMutation = createMutation({
		mutationFn: async () => {
			await api.auth.authLogoutCreate();
		},
		onSuccess: async () => {
			auth.clear();
			client.invalidateQueries({ queryKey: ['user'] });
			await goto('/');
		}
	});

	function logout() {
		$logoutMutation.mutate();
	}

	let mobileMenuOpen = $state(false);

	const isLoggedIn = $derived($user.isSuccess && $user.data !== null && $user.data !== undefined);
	const isAdmin = $derived(isLoggedIn && $user.data?.role === UserRole.Value1);

	const navLinks = [
		{ href: '/movies', label: 'Movies' },
		{ href: '/cinemas', label: 'Cinemas' },
		{ href: '/showtimes', label: 'Showtimes' },
		{ href: '/about', label: 'About' }
	];

	const adminLinks = [{ href: '/users', label: 'Users' }];

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-40 border-b border-accent/15 bg-surface text-text">
	<div class="container mx-auto flex items-center justify-between px-5 py-4">
		<a href="/" class="flex items-center gap-2 text-accent">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
				<path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
			</svg>
			<span class="text-lg font-bold tracking-wide">Movie Reservation</span>
		</a>

		<nav class="hidden items-center gap-6 text-sm md:flex">
			{#each navLinks as link (link.href)}
				<a href={link.href} class="transition-colors hover:text-accent">{link.label}</a>
			{/each}
			{#if isAdmin}
				{#each adminLinks as link (link.href)}
					<a href={link.href} class="transition-colors hover:text-accent">{link.label}</a>
				{/each}
			{/if}
		</nav>

		<div class="hidden items-center gap-4 md:flex">
			<ThemeToggle />
			{#if isLoggedIn}
				<a href="/profile" class="text-sm transition-colors hover:text-accent">{$user.data?.username}</a>
				<button
					aria-label="Log out"
					onclick={logout}
					class="rounded-full border border-accent px-4 py-1.5 text-sm text-accent transition-colors hover:bg-accent hover:text-primary"
				>
					Logout
				</button>
			{:else}
				<a
					href="/auth"
					class="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
				>
					Login
				</a>
			{/if}
		</div>

		<button
			aria-label="Toggle menu"
			class="text-text md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">
					<path d="M3 6h18M3 12h18M3 18h18" />
				</svg>
			{/if}
		</button>
	</div>

	{#if mobileMenuOpen}
		<div class="flex flex-col gap-4 border-t border-accent/15 px-5 py-4 md:hidden">
			{#each navLinks as link (link.href)}
				<a href={link.href} onclick={closeMobileMenu} class="hover:text-accent">{link.label}</a>
			{/each}
			{#if isAdmin}
				{#each adminLinks as link (link.href)}
					<a href={link.href} onclick={closeMobileMenu} class="hover:text-accent">{link.label}</a>
				{/each}
			{/if}
			<div class="flex items-center justify-between border-t border-accent/10 pt-4">
				<ThemeToggle />
				{#if isLoggedIn}
					<button aria-label="Log out" onclick={logout} class="text-sm text-accent">
						Logout ({$user.data?.username})
					</button>
				{:else}
					<a href="/auth" onclick={closeMobileMenu} class="text-sm font-medium text-accent">Login</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
