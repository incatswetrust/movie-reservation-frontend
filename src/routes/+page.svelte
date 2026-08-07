<script lang="ts">
	import { type MovieReadDto } from '../Api';
	import { api } from '../Module';
	import { createQuery } from '@tanstack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import MovieCard from '$lib/comps/MovieCard.svelte';

	const movies = createQuery<MovieReadDto[]>({
		queryKey: ['movies'],
		queryFn: async () => {
			const response: AxiosResponse<MovieReadDto[]> = await api.movies.moviesList();
			return response.data;
		}
	});
</script>

<svelte:head>
	<title>Movie Reservation System</title>
</svelte:head>

<section class="container mx-auto flex flex-col items-center gap-6 px-5 py-24 text-center">
	<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
		Your next movie night <span class="text-accent">starts here</span>
	</h1>
	<p class="max-w-xl text-text/70">
		Browse showtimes, pick your seats, and book tickets in a few clicks.
	</p>
	<a
		href="/movies"
		class="rounded-full bg-accent px-8 py-3 font-medium text-primary transition-opacity hover:opacity-90"
	>
		Book Tickets
	</a>
</section>

<section class="container mx-auto px-5 pb-24">
	<h2 class="mb-6 text-2xl font-semibold">Now Showing</h2>

	{#if $movies.isLoading}
		<p class="text-text/60">Loading movies...</p>
	{:else if $movies.isSuccess && $movies.data.length > 0}
		<div class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
			{#each $movies.data as movie (movie.id)}
				<div class="w-40 shrink-0 snap-start sm:w-48">
					<MovieCard {movie} />
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-text/60">No movies available right now.</p>
	{/if}
</section>
