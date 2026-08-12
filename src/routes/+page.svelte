<script lang="ts">
	import { type MovieReadDto } from '../Api';
	import { api } from '../Module';
	import { createQuery } from '@tanstack/svelte-query';
	import MovieCard from '$lib/comps/MovieCard.svelte';

	const movies = createQuery<MovieReadDto[]>({
		queryKey: ['movies'],
		queryFn: async () => {
			const response = await api.movies.moviesList();
			return response.data.items ?? [];
		}
	});
</script>

<svelte:head>
	<title>Movie Reservation System</title>
</svelte:head>

<section class="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 py-20 text-center sm:px-5 sm:py-28">
	<h1
		class="max-w-3xl text-[clamp(32px,4vw,48px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
	>
		Your next movie night <span class="text-brand-gold">starts here</span>
	</h1>
	<p class="max-w-xl text-[15px] leading-relaxed text-ink-secondary">
		Browse showtimes, pick your seats, and book tickets in a few clicks.
	</p>
	<a href="/movies" class="btn-primary mt-2">Book Tickets</a>
</section>

<section class="mx-auto max-w-[1440px] px-4 pb-20 sm:px-5 sm:pb-28">
	<h2 class="mb-5 text-[20px] font-bold leading-[1.2] text-ink sm:mb-6">Now Showing</h2>

	{#if $movies.isLoading}
		<p class="text-[15px] text-ink-muted">Loading movies...</p>
	{:else if $movies.isSuccess && $movies.data.length > 0}
		<div class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
			{#each $movies.data as movie (movie.id)}
				<div class="w-40 shrink-0 snap-start sm:w-48">
					<MovieCard {movie} />
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-[15px] text-ink-muted">No movies available right now.</p>
	{/if}
</section>
