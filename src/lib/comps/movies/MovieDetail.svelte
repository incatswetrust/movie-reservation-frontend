<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import type { MovieReadDto, ShowtimeReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { FormatParser } from '$lib/tools/FormatParser';
	import NewMovie from './NewMovie.svelte';

	let { Id }: { Id: number } = $props();

	const client = useQueryClient();

	const movie = createQuery<MovieReadDto>({
		queryKey: ['movie', Id],
		queryFn: async () => {
			const response = await api.movies.moviesDetail(Id);
			return response.data;
		}
	});

	const showtimes = createQuery<ShowtimeReadDto[]>({
		queryKey: ['showtimes', 'movie', Id],
		queryFn: async () => {
			const response = await api.showtimes.showtimesMovieDetail(Id);
			return response.data;
		}
	});

	let sortedShowtimes = $derived(
		[...($showtimes.data ?? [])].sort((a, b) => {
			const timeA = a.startTime ? new Date(a.startTime).getTime() : 0;
			const timeB = b.startTime ? new Date(b.startTime).getTime() : 0;
			return timeA - timeB;
		})
	);

	function trailerEmbedUrl(url: string | null | undefined): string | null {
		if (!url) return null;
		const watchMatch = url.match(/[?&]v=([^&]+)/);
		const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
		const id = watchMatch?.[1] ?? shortMatch?.[1];
		return id ? `https://www.youtube.com/embed/${id}` : url;
	}

	let isNewMovieOpen = $state(false);

	const deleteMutation = createMutation({
		mutationFn: async () => {
			await api.movies.moviesDelete(Id);
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['movies'] });
			toast.show('Movie deleted', 'success');
			await goto('/movies');
		},
		onError: () => {
			toast.show('Failed to delete movie', 'error');
		}
	});

	function handleDelete() {
		if (!$movie.data) return;
		if (confirm(`Delete "${$movie.data.title}"? This cannot be undone.`)) {
			$deleteMutation.mutate();
		}
	}

	async function bookShowtime(showtimeId: number | undefined) {
		if (showtimeId !== undefined) await goto(`/booking/${showtimeId}`);
	}
</script>

{#if $movie.isSuccess && $movie.data}
	<section class="bg-primary">
		<div class="container mx-auto px-5 py-10">
			<div class="flex flex-col gap-8 lg:flex-row">
				<div class="lg:w-1/3">
					<img
						src={$movie.data.posterUrl || $movie.data.base64Image || undefined}
						alt={$movie.data.title ?? 'Movie poster'}
						class="w-full rounded-lg object-cover shadow-lg"
					/>
				</div>

				<div class="lg:w-2/3">
					<div class="mb-2 flex flex-wrap items-start justify-between gap-3">
						<h1 class="text-3xl font-bold text-text">{$movie.data.title}</h1>
						{#if $auth.isAdmin}
							<div class="flex gap-2">
								<button
									onclick={() => (isNewMovieOpen = true)}
									class="rounded-full border border-accent/40 px-4 py-1.5 text-sm text-text transition-colors hover:bg-accent/10"
								>
									Edit
								</button>
								<button
									onclick={handleDelete}
									class="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
								>
									Delete
								</button>
							</div>
						{/if}
					</div>

					<div class="mb-4 flex flex-wrap items-center gap-3 text-sm text-text/70">
						{#if $movie.data.imdbRating}
							<span class="flex items-center gap-1 font-semibold text-accent">
								★ {$movie.data.imdbRating}
							</span>
						{/if}
						<span>{$movie.data.releaseYear}</span>
						<span>&middot;</span>
						<span>{$movie.data.genre}</span>
						<span>&middot;</span>
						<span>{FormatParser.formatMinutesToHours($movie.data.duration)}</span>
						{#if $movie.data.ageRating}
							<span>&middot;</span>
							<span class="rounded border border-accent/30 px-1.5 py-0.5 text-xs">{$movie.data.ageRating}</span>
						{/if}
					</div>

					<p class="mb-6 leading-relaxed text-text/80">{$movie.data.description}</p>

					<dl class="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
						{#if $movie.data.director}
							<div>
								<dt class="text-text/50">Director</dt>
								<dd class="text-text">{$movie.data.director}</dd>
							</div>
						{/if}
						{#if $movie.data.cast}
							<div>
								<dt class="text-text/50">Cast</dt>
								<dd class="text-text">{$movie.data.cast}</dd>
							</div>
						{/if}
						{#if $movie.data.language}
							<div>
								<dt class="text-text/50">Language</dt>
								<dd class="text-text">{$movie.data.language}</dd>
							</div>
						{/if}
						{#if $movie.data.country}
							<div>
								<dt class="text-text/50">Country</dt>
								<dd class="text-text">{$movie.data.country}</dd>
							</div>
						{/if}
					</dl>

					{#if trailerEmbedUrl($movie.data.trailerUrl)}
						<div class="mb-6 aspect-video w-full overflow-hidden rounded-lg">
							<iframe
								class="h-full w-full"
								src={trailerEmbedUrl($movie.data.trailerUrl)}
								title="Trailer"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					{/if}

					<div class="rounded-lg border border-accent/15 bg-surface p-5">
						<h2 class="mb-4 text-xl font-semibold text-text">Showtimes</h2>

						{#if $showtimes.isSuccess && sortedShowtimes.length > 0}
							<div class="flex flex-col divide-y divide-accent/10">
								{#each sortedShowtimes as st}
									<div class="flex flex-wrap items-center justify-between gap-3 py-3">
										<div>
											<p class="text-text">{st.cinemaName} &middot; {st.hallName}</p>
											<p class="text-sm text-text/60">{FormatParser.formatDateTime(st.startTime)}</p>
										</div>
										<div class="flex items-center gap-3">
											<span class="text-accent">${st.price}</span>
											<button
												onclick={() => bookShowtime(st.id)}
												class="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
											>
												Book
											</button>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-text/60">No showtimes scheduled yet.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<NewMovie bind:IsOpenned={isNewMovieOpen} movie={$movie.data} />
{/if}
