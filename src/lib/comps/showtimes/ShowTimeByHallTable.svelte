<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { ShowtimeReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { FormatParser } from '$lib/tools/FormatParser';
	import NewShowtimeByHall from './NewShowtimeByHall.svelte';

	let { HallId }: { HallId: number } = $props();

	const client = useQueryClient();

	const showtimes = createQuery<ShowtimeReadDto[]>({
		queryKey: ['showtimes', 'hall', HallId],
		queryFn: async () => {
			const response = await api.showtimes.showtimesHallDetail(HallId);
			return response.data;
		}
	});

	const deleteMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.showtimes.showtimesDelete(id);
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['showtimes'] });
			toast.show('Showtime deleted', 'success');
		},
		onError: () => {
			toast.show('Failed to delete showtime', 'error');
		}
	});

	function handleDelete(id: number | undefined) {
		if (id === undefined) return;
		if (confirm('Delete this showtime?')) {
			$deleteMutation.mutate(id);
		}
	}

	let isNewShowtimeOpen = $state(false);
</script>

<section>
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<h2 class="text-lg font-semibold text-text">Showtimes</h2>
		{#if $auth.isAdmin}
			<button
				onclick={() => (isNewShowtimeOpen = true)}
				class="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
			>
				+ Add showtime
			</button>
		{/if}
	</div>

	{#if $showtimes.isLoading}
		<p class="text-text/60">Loading showtimes...</p>
	{:else if $showtimes.isError}
		<p class="text-red-400">Failed to load showtimes.</p>
	{:else if $showtimes.data && $showtimes.data.length > 0}
		<div class="rounded-lg border border-accent/15 bg-surface">
			<div class="flex flex-col divide-y divide-accent/10">
				{#each $showtimes.data as showtime (showtime.id)}
					<div class="flex flex-wrap items-center justify-between gap-3 p-4">
						<div>
							<p class="text-text">{showtime.movieName}</p>
							<p class="text-sm text-text/60">{FormatParser.formatDateTime(showtime.startTime)}</p>
						</div>
						<div class="flex items-center gap-3">
							<span class="text-accent">${showtime.price}</span>
							{#if $auth.isAdmin}
								<button
									onclick={() => handleDelete(showtime.id)}
									class="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
								>
									Delete
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-text/60">No showtimes scheduled for this hall yet.</p>
	{/if}
</section>

<NewShowtimeByHall HallId={HallId} bind:IsOpenned={isNewShowtimeOpen} />
