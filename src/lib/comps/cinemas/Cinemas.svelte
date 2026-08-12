<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { type CinemaReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import NewCinema from './NewCinema.svelte';
	import CinemaCard from './CinemaCard.svelte';

	const client = useQueryClient();

	const cinemas = createQuery<CinemaReadDto[]>({
		queryKey: ['cinemas'],
		queryFn: async () => {
			const response = await api.cinemas.cinemasList({ page: 1, pageSize: 100 });
			return response.data.items ?? [];
		}
	});

	const deleteMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.cinemas.cinemasDelete(id);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['cinemas'] });
		}
	});

	let searchInput = $state('');
	let debouncedSearch = $state('');
	let searchTimer: ReturnType<typeof setTimeout>;

	function onSearchInput() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			debouncedSearch = searchInput.trim();
		}, 350);
	}

	let searchResults = $state<CinemaReadDto[] | null>(null);
	let isSearching = $state(false);

	$effect(() => {
		if (debouncedSearch.length === 0) {
			searchResults = null;
			return;
		}
		isSearching = true;
		api.cinemas
			.cinemasSearchList({ q: debouncedSearch })
			.then((response) => {
				searchResults = response.data;
			})
			.finally(() => {
				isSearching = false;
			});
	});

	let displayedCinemas = $derived(
		debouncedSearch.length > 0 ? (searchResults ?? []) : ($cinemas.data ?? [])
	);

	let isBusy = $derived(debouncedSearch.length > 0 ? isSearching : $cinemas.isFetching);

	let isNewCinemaOpen = $state(false);

	function handleEdit(cinema: CinemaReadDto) {
		if (cinema.id !== undefined) void goto(`/cinemas/${cinema.id}`);
	}

	function handleDelete(cinema: CinemaReadDto) {
		if (cinema.id === undefined) return;
		if (confirm(`Delete "${cinema.name}"? This cannot be undone.`)) {
			$deleteMutation.mutate(cinema.id);
		}
	}
</script>

<section class="bg-app">
	<div class="container mx-auto px-5 py-10 sm:px-8 lg:px-10">
		<div class="mb-10 flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 class="text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight text-ink">
					Cinemas
				</h1>
				<div class="mt-3 h-1 w-16 rounded-full bg-brand-gold"></div>
				<p class="mt-3 text-[15px] text-ink-secondary">
					Find a cinema near you and browse its halls.
				</p>
			</div>
			{#if $auth.isAdmin}
				<button onclick={() => (isNewCinemaOpen = true)} class="btn-primary">+ Add cinema</button>
			{/if}
		</div>

		<div class="mb-8">
			<input
				bind:value={searchInput}
				oninput={onSearchInput}
				type="search"
				placeholder="Search by name or address..."
				class="input max-w-md"
			/>
		</div>

		{#if $cinemas.isLoading}
			<p class="text-ink-muted">Loading cinemas...</p>
		{:else if $cinemas.isError}
			<p class="text-brand-red">Failed to load cinemas.</p>
		{:else if isBusy}
			<p class="text-ink-muted">Searching...</p>
		{:else if displayedCinemas.length > 0}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each displayedCinemas as cinema (cinema.id)}
					<CinemaCard {cinema} isAdmin={$auth.isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
				{/each}
			</div>
		{:else}
			<p class="text-ink-muted">No cinemas yet.</p>
		{/if}
	</div>
</section>

<NewCinema bind:IsOpenned={isNewCinemaOpen} />
