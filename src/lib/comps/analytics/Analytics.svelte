<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import type { RevenueSummaryDto, ShowtimeOccupancyDto, TopMovieDto } from '../../../Api';
	import { api } from '../../../Module';
	import { FormatParser } from '$lib/tools/FormatParser';

	const revenue = createQuery<RevenueSummaryDto>({
		queryKey: ['analytics', 'revenue'],
		queryFn: async () => {
			const response = await api.analytics.analyticsRevenueList();
			return response.data;
		}
	});

	const topMovies = createQuery<TopMovieDto[]>({
		queryKey: ['analytics', 'top-movies'],
		queryFn: async () => {
			const response = await api.analytics.analyticsTopMoviesList();
			return response.data;
		}
	});

	const occupancy = createQuery<ShowtimeOccupancyDto[]>({
		queryKey: ['analytics', 'occupancy'],
		queryFn: async () => {
			const response = await api.analytics.analyticsOccupancyList();
			return response.data;
		}
	});

	function formatCurrency(value: number | undefined): string {
		return `$${(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	function formatPercentage(value: number | undefined): string {
		return `${(value ?? 0).toFixed(1)}%`;
	}
</script>

<section class="bg-app">
	<div class="container mx-auto px-5 py-10">
		<div>
			<h1 class="text-2xl font-bold text-ink sm:text-3xl">Analytics</h1>
			<div class="mt-2 h-1 w-16 rounded-full bg-brand-gold"></div>
			<p class="mt-3 text-ink-secondary">Revenue, top movies, and showtime occupancy at a glance.</p>
		</div>

		<!-- Revenue summary -->
		<div class="mt-8">
			{#if $revenue.isLoading}
				<p class="text-ink-muted">Loading revenue summary...</p>
			{:else if $revenue.isError}
				<p class="text-brand-red">Failed to load revenue summary.</p>
			{:else if $revenue.data}
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
					<div class="card p-6">
						<p class="text-sm font-medium text-ink-secondary">Total revenue</p>
						<p class="mt-2 text-[32px] font-bold leading-none tracking-[-0.02em] text-ink">
							{formatCurrency($revenue.data.totalRevenue)}
						</p>
					</div>
					<div class="card p-6">
						<p class="text-sm font-medium text-ink-secondary">Revenue (last 30 days)</p>
						<p class="mt-2 text-[32px] font-bold leading-none tracking-[-0.02em] text-brand-gold">
							{formatCurrency($revenue.data.revenueLast30Days)}
						</p>
					</div>
					<div class="card p-6">
						<p class="text-sm font-medium text-ink-secondary">Total bookings</p>
						<p class="mt-2 text-[32px] font-bold leading-none tracking-[-0.02em] text-ink">
							{$revenue.data.totalBookingsCount ?? 0}
						</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Top movies -->
		<div class="mt-10">
			<h2 class="text-xl font-bold text-ink">Top movies</h2>
			<p class="mt-1 text-sm text-ink-secondary">Ranked by seats booked.</p>

			<div class="mt-4">
				{#if $topMovies.isLoading}
					<p class="text-ink-muted">Loading top movies...</p>
				{:else if $topMovies.isError}
					<p class="text-brand-red">Failed to load top movies.</p>
				{:else if $topMovies.data && $topMovies.data.length > 0}
					<div class="card overflow-x-auto">
						<table class="min-w-full text-left text-sm">
							<thead class="bg-surface-secondary text-ink-secondary">
								<tr>
									<th class="px-4 py-3 font-semibold">#</th>
									<th class="px-4 py-3 font-semibold">Title</th>
									<th class="px-4 py-3 font-semibold">Seats booked</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-subtle">
								{#each $topMovies.data as movie, i (movie.movieId)}
									<tr class="text-ink transition-colors duration-fast hover:bg-surface-secondary">
										<td class="px-4 py-3 font-bold {i === 0 ? 'text-brand-gold' : 'text-ink-muted'}">
											{i + 1}
										</td>
										<td class="px-4 py-3 font-medium">{movie.title}</td>
										<td class="px-4 py-3 text-ink-secondary">{movie.bookedSeatsCount ?? 0}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="text-ink-muted">No booking data yet.</p>
				{/if}
			</div>
		</div>

		<!-- Showtime occupancy -->
		<div class="mt-10">
			<h2 class="text-xl font-bold text-ink">Showtime occupancy</h2>
			<p class="mt-1 text-sm text-ink-secondary">Seats booked for upcoming showtimes.</p>

			<div class="mt-4">
				{#if $occupancy.isLoading}
					<p class="text-ink-muted">Loading occupancy...</p>
				{:else if $occupancy.isError}
					<p class="text-brand-red">Failed to load occupancy.</p>
				{:else if $occupancy.data && $occupancy.data.length > 0}
					<div class="card overflow-x-auto">
						<table class="min-w-full text-left text-sm">
							<thead class="bg-surface-secondary text-ink-secondary">
								<tr>
									<th class="px-4 py-3 font-semibold">Movie</th>
									<th class="px-4 py-3 font-semibold">Cinema / Hall</th>
									<th class="px-4 py-3 font-semibold">Start time</th>
									<th class="px-4 py-3 font-semibold">Seats</th>
									<th class="px-4 py-3 font-semibold">Occupancy</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-subtle">
								{#each $occupancy.data as st (st.showtimeId)}
									<tr class="text-ink transition-colors duration-fast hover:bg-surface-secondary">
										<td class="px-4 py-3 font-medium">{st.movieTitle}</td>
										<td class="px-4 py-3 text-ink-secondary">{st.cinemaName} &middot; {st.hallName}</td>
										<td class="px-4 py-3 text-ink-secondary">{FormatParser.formatDateTime(st.startTime)}</td>
										<td class="px-4 py-3 text-ink-secondary">
											{st.bookedSeatsCount ?? 0}/{st.totalSeatsCount ?? 0}
										</td>
										<td class="px-4 py-3 font-semibold text-brand-gold">
											{formatPercentage(st.occupancyPercentage)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="text-ink-muted">No upcoming showtimes.</p>
				{/if}
			</div>
		</div>
	</div>
</section>
