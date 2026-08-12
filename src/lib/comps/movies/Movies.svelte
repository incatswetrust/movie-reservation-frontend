<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { type MovieReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import MovieCard from '$lib/comps/MovieCard.svelte';
	import NewMovie from './NewMovie.svelte';

	const client = useQueryClient();

	const allMovies = createQuery<MovieReadDto[]>({
		queryKey: ['movies'],
		queryFn: async () => {
			const response = await api.movies.moviesList({ page: 1, pageSize: 100 });
			return response.data.items ?? [];
		}
	});

	let genres = $derived(
		[...new Set(($allMovies.data ?? []).map((m) => m.genre).filter((g): g is string => !!g))].sort()
	);

	let searchInput = $state('');
	let debouncedSearch = $state('');
	let selectedGenre = $state('');
	let searchTimer: ReturnType<typeof setTimeout>;

	function onSearchInput() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			debouncedSearch = searchInput.trim();
		}, 350);
	}

	let searchResults = $state<MovieReadDto[] | null>(null);
	let isSearching = $state(false);

	$effect(() => {
		if (debouncedSearch.length === 0) {
			searchResults = null;
			return;
		}
		isSearching = true;
		api.movies
			.moviesSearchList({ q: debouncedSearch })
			.then((response) => {
				searchResults = response.data;
			})
			.finally(() => {
				isSearching = false;
			});
	});

	let filterResults = $state<MovieReadDto[] | null>(null);
	let isFiltering = $state(false);

	$effect(() => {
		if (debouncedSearch.length > 0 || selectedGenre.length === 0) {
			filterResults = null;
			return;
		}
		isFiltering = true;
		api.movies
			.moviesFilterList({ genre: selectedGenre })
			.then((response) => {
				filterResults = response.data;
			})
			.finally(() => {
				isFiltering = false;
			});
	});

	let displayedMovies = $derived(
		debouncedSearch.length > 0
			? (searchResults ?? [])
			: selectedGenre.length > 0
				? (filterResults ?? [])
				: ($allMovies.data ?? [])
	);

	let isBusy = $derived(debouncedSearch.length > 0 ? isSearching : selectedGenre.length > 0 ? isFiltering : $allMovies.isFetching);

	const deleteMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.movies.moviesDelete(id);
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['movies'] });
			toast.show('Movie deleted', 'success');
		},
		onError: () => {
			toast.show('Failed to delete movie', 'error');
		}
	});

	let isNewMovieOpen = $state(false);
	let movieBeingEdited = $state<MovieReadDto | null>(null);

	function handleAdd() {
		movieBeingEdited = null;
		isNewMovieOpen = true;
	}

	function handleEdit(movie: MovieReadDto) {
		movieBeingEdited = movie;
		isNewMovieOpen = true;
	}

	function handleDelete(movie: MovieReadDto) {
		if (movie.id === undefined) return;
		if (confirm(`Delete "${movie.title}"? This cannot be undone.`)) {
			$deleteMutation.mutate(movie.id);
		}
	}
</script>

<section class="bg-app">
	<div class="container mx-auto px-5 py-10">
		<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 class="text-2xl font-semibold text-ink sm:text-3xl">Movies</h1>
				<div class="mt-2 h-1 w-16 rounded bg-brand-gold"></div>
				<p class="mt-3 text-ink-secondary">Browse what's playing and pick your next watch.</p>
			</div>
			{#if $auth.isAdmin}
				<button onclick={handleAdd} class="btn-primary"> + Add movie </button>
			{/if}
		</div>

		<div class="mb-8 flex flex-col gap-4">
			<input
				bind:value={searchInput}
				oninput={onSearchInput}
				type="search"
				placeholder="Search by title or director..."
				class="input max-w-md"
			/>
			{#if genres.length > 0}
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						onclick={() => (selectedGenre = '')}
						class={selectedGenre === '' ? 'chip chip-selected' : 'chip hover:border-brand-gold'}
					>
						All genres
					</button>
					{#each genres as genre}
						<button
							type="button"
							onclick={() => (selectedGenre = genre)}
							class={selectedGenre === genre ? 'chip chip-selected' : 'chip hover:border-brand-gold'}
						>
							{genre}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if $allMovies.isLoading}
			<p class="text-ink-secondary">Loading movies...</p>
		{:else if $allMovies.isError}
			<p class="text-brand-red">Failed to load movies.</p>
		{:else if isBusy}
			<p class="text-ink-secondary">Searching...</p>
		{:else if displayedMovies.length > 0}
			<div class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
				{#each displayedMovies as movie (movie.id)}
					<MovieCard {movie} isAdmin={$auth.isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
				{/each}
			</div>
		{:else}
			<p class="text-ink-secondary">No movies found.</p>
		{/if}
	</div>
</section>

<NewMovie bind:IsOpenned={isNewMovieOpen} movie={movieBeingEdited} />
