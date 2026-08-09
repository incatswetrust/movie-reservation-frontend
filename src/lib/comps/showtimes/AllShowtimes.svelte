<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import type { ShowtimeReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { FormatParser } from '$lib/tools/FormatParser';

	const allShowtimes = createQuery<ShowtimeReadDto[]>({
		queryKey: ['showtimes'],
		queryFn: async () => {
			const response = await api.showtimes.showtimesList();
			return response.data;
		}
	});

	let dateFilter = $state('');
	let cinemaFilter = $state('');

	let dateFilteredShowtimes = $state<ShowtimeReadDto[] | null>(null);
	let isLoadingDate = $state(false);

	$effect(() => {
		if (!dateFilter) {
			dateFilteredShowtimes = null;
			return;
		}
		isLoadingDate = true;
		api.showtimes
			.showtimesAvailableList({ date: dateFilter })
			.then((response) => {
				dateFilteredShowtimes = response.data;
			})
			.finally(() => {
				isLoadingDate = false;
			});
	});

	let baseShowtimes = $derived(dateFilter ? (dateFilteredShowtimes ?? []) : ($allShowtimes.data ?? []));

	let cinemas = $derived(
		[...new Set(($allShowtimes.data ?? []).map((s) => s.cinemaName).filter((c): c is string => !!c))].sort()
	);

	let visibleShowtimes = $derived(
		cinemaFilter ? baseShowtimes.filter((s) => s.cinemaName === cinemaFilter) : baseShowtimes
	);

	let groupedByDate = $derived.by(() => {
		const groups = new Map<string, ShowtimeReadDto[]>();
		for (const st of visibleShowtimes) {
			const key = st.startTime
				? new Date(st.startTime).toLocaleDateString('en-US', {
						weekday: 'short',
						month: 'short',
						day: 'numeric'
					})
				: 'Unscheduled';
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(st);
		}
		for (const items of groups.values()) {
			items.sort((a, b) => new Date(a.startTime ?? 0).getTime() - new Date(b.startTime ?? 0).getTime());
		}
		return [...groups.entries()].sort(
			([, a], [, b]) => new Date(a[0]?.startTime ?? 0).getTime() - new Date(b[0]?.startTime ?? 0).getTime()
		);
	});

	async function bookShowtime(id: number | undefined) {
		if (id !== undefined) await goto(`/booking/${id}`);
	}
</script>

<div class="mb-8 flex flex-wrap gap-3">
	<input
		bind:value={dateFilter}
		type="date"
		class="rounded border border-accent/30 bg-surface px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
	/>
	<select
		bind:value={cinemaFilter}
		class="rounded border border-accent/30 bg-surface px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
	>
		<option value="">All cinemas</option>
		{#each cinemas as cinema}
			<option value={cinema}>{cinema}</option>
		{/each}
	</select>
</div>

{#if $allShowtimes.isError}
	<p class="text-red-400">Failed to load showtimes.</p>
{:else if $allShowtimes.isLoading || isLoadingDate}
	<p class="text-text/60">Loading showtimes...</p>
{:else if groupedByDate.length > 0}
	<div class="flex flex-col gap-8">
		{#each groupedByDate as [date, items]}
			<div>
				<h2 class="mb-3 text-lg font-semibold text-text">{date}</h2>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each items as st}
						<div class="flex flex-col gap-2 rounded-lg border border-accent/15 bg-surface p-4">
							<h3 class="font-semibold text-text">{st.movieName}</h3>
							<p class="text-sm text-text/70">{st.cinemaName} &middot; {st.hallName}</p>
							<div class="mt-1 flex items-center justify-between">
								<span class="text-sm text-text/80">{FormatParser.formatDateTime(st.startTime)}</span>
								<span class="text-accent">${st.price}</span>
							</div>
							<button
								onclick={() => bookShowtime(st.id)}
								class="mt-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
							>
								Book
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-text/60">No showtimes found.</p>
{/if}
