<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { api } from '../../Module';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';

	const logoutMutation = createMutation({
		mutationFn: async () => {
			await api.auth.authLogoutCreate();
		},
		onSuccess: async () => {
			auth.clear();
			await goto('/');
		}
	});

	function logout() {
		$logoutMutation.mutate();
	}

	let mobileMenuOpen = $state(false);

	const isLoggedIn = $derived($auth.isAuthenticated);
	const canAccessAdminPanel = $derived($auth.isAdmin || $auth.isViewer);
	const currentPath = $derived($page.url.pathname);

	function isActive(href: string) {
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	const navLinks = [
		{ href: '/movies', label: 'Movies' },
		{ href: '/cinemas', label: 'Cinemas' },
		{ href: '/showtimes', label: 'Showtimes' },
		{ href: '/about', label: 'About' }
	];

	const adminLinks = [
		{ href: '/users', label: 'Users', adminOnly: false },
		// Analytics is Admin-only on the backend (no Viewer access), unlike the other admin-panel links.
		{ href: '/analytics', label: 'Analytics', adminOnly: true }
	];

	const visibleAdminLinks = $derived(adminLinks.filter((link) => !link.adminOnly || $auth.isAdmin));

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-40 border-b border-subtle bg-surface text-ink">
	<div class="container mx-auto flex items-center justify-between px-5 py-4">
		<a href="/" class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 16 16"
				class="text-brand-gold"
			>
				<path
					d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"
				/>
			</svg>
			<span class="text-lg font-bold tracking-wide text-ink">Movie Reservation</span>
		</a>

		<nav class="hidden items-center gap-6 text-sm md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="relative py-1 transition-colors duration-fast {isActive(link.href)
						? 'text-brand-gold'
						: 'text-ink-secondary hover:text-ink'}"
				>
					{link.label}
					{#if isActive(link.href)}
						<span class="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-gold"></span>
					{/if}
				</a>
			{/each}
			{#if canAccessAdminPanel}
				{#each visibleAdminLinks as link (link.href)}
					<a
						href={link.href}
						class="relative py-1 transition-colors duration-fast {isActive(link.href)
							? 'text-brand-gold'
							: 'text-ink-secondary hover:text-ink'}"
					>
						{link.label}
						{#if isActive(link.href)}
							<span class="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-gold"></span>
						{/if}
					</a>
				{/each}
			{/if}
		</nav>

		<div class="hidden items-center gap-4 md:flex">
			<ThemeToggle />
			{#if isLoggedIn}
				<a href="/profile" class="text-sm text-ink-secondary transition-colors duration-fast hover:text-ink">
					{$auth.user?.username}
				</a>
				<button
					aria-label="Log out"
					onclick={logout}
					class="btn-secondary min-h-0 px-4 py-1.5 text-sm"
				>
					Logout
				</button>
			{:else}
				<a href="/auth" class="btn-primary min-h-0 px-4 py-1.5 text-sm">Login</a>
			{/if}
		</div>

		<button
			aria-label="Toggle menu"
			class="icon-button md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					viewBox="0 0 24 24"
				>
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					viewBox="0 0 24 24"
				>
					<path d="M3 6h18M3 12h18M3 18h18" />
				</svg>
			{/if}
		</button>
	</div>

	{#if mobileMenuOpen}
		<div class="flex flex-col gap-4 border-t border-subtle bg-surface px-5 py-4 md:hidden">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					onclick={closeMobileMenu}
					class="flex items-center gap-2 {isActive(link.href) ? 'text-brand-gold' : 'text-ink-secondary hover:text-ink'}"
				>
					{#if isActive(link.href)}
						<span class="h-1.5 w-1.5 rounded-full bg-brand-gold"></span>
					{/if}
					{link.label}
				</a>
			{/each}
			{#if canAccessAdminPanel}
				{#each visibleAdminLinks as link (link.href)}
					<a
						href={link.href}
						onclick={closeMobileMenu}
						class="flex items-center gap-2 {isActive(link.href) ? 'text-brand-gold' : 'text-ink-secondary hover:text-ink'}"
					>
						{#if isActive(link.href)}
							<span class="h-1.5 w-1.5 rounded-full bg-brand-gold"></span>
						{/if}
						{link.label}
					</a>
				{/each}
			{/if}
			<div class="flex items-center justify-between border-t border-subtle pt-4">
				<ThemeToggle />
				{#if isLoggedIn}
					<button aria-label="Log out" onclick={logout} class="text-sm font-medium text-ink-secondary">
						Logout ({$auth.user?.username})
					</button>
				{:else}
					<a href="/auth" onclick={closeMobileMenu} class="btn-primary min-h-0 px-4 py-1.5 text-sm">Login</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
