<script lang="ts">
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { derived as storeDerived } from 'svelte/store';
	import {
		type SeatReadDto,
		type CinemaReadDto,
		type HallReadDto,
		type ShowtimeReadDto,
		type MovieReadDto,
		type BookingReadDto,
		type BookingCreateDto
	} from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { FormatParser } from '$lib/tools/FormatParser';
	import { goto } from '$app/navigation';

	let { Id }: { Id: number } = $props();

	const showtime = createQuery<ShowtimeReadDto>({
		queryKey: ['showtime', Id],
		queryFn: async () => {
			const response = await api.showtimes.showtimesDetail(Id);
			return response.data;
		}
	});

	const hallOptions = storeDerived(showtime, ($showtime) => ({
		queryKey: ['hall', $showtime.data?.hallId],
		queryFn: async () => {
			const response = await api.halls.hallsDetail($showtime.data?.hallId ?? 0);
			return response.data;
		},
		enabled: !!$showtime.data?.hallId
	}));
	const hall = createQuery<HallReadDto>(hallOptions);

	const cinemaOptions = storeDerived(hall, ($hall) => ({
		queryKey: ['cinema', $hall.data?.cinemaId],
		queryFn: async () => {
			const response = await api.cinemas.cinemasDetail($hall.data?.cinemaId ?? 0);
			return response.data;
		},
		enabled: !!$hall.data?.cinemaId
	}));
	const cinema = createQuery<CinemaReadDto>(cinemaOptions);

	const movieOptions = storeDerived(showtime, ($showtime) => ({
		queryKey: ['movie', $showtime.data?.movieId],
		queryFn: async () => {
			const response = await api.movies.moviesDetail($showtime.data?.movieId ?? 0);
			return response.data;
		},
		enabled: !!$showtime.data?.movieId
	}));
	const movie = createQuery<MovieReadDto>(movieOptions);

	const seats = createQuery<SeatReadDto[]>({
		queryKey: ['seats', Id],
		queryFn: async () => {
			const response = await api.seats.seatsDetail(Id);
			return response.data;
		}
	});

	let groupedByRow = $derived(
		($seats.data ?? []).reduce(
			(acc, seat) => {
				if (!seat.rowLabel) return acc;
				(acc[seat.rowLabel] ??= []).push(seat);
				return acc;
			},
			{} as Record<string, SeatReadDto[]>
		)
	);

	let selectedSeatIds = $state<number[]>([]);
	let selectionError = $state('');

	function toggleSeat(seat: SeatReadDto) {
		if (seat.isReserved || seat.id == null) return;
		selectionError = '';
		selectedSeatIds = selectedSeatIds.includes(seat.id)
			? selectedSeatIds.filter((id) => id !== seat.id)
			: [...selectedSeatIds, seat.id];
	}

	let totalPrice = $derived((($showtime.data?.price ?? 0) * selectedSeatIds.length).toFixed(2));

	const confirmMutation = createMutation({
		mutationFn: async () => {
			const dto: BookingCreateDto = {
				userId: $auth.user?.id,
				showtimeId: Id,
				seatIds: selectedSeatIds
			};
			const response = await api.bookings.bookingsCreate(dto);
			return response.data as BookingReadDto;
		},
		onSuccess: async () => {
			toast.show('Booking confirmed', 'success');
			await goto('/profile');
		},
		onError: () => {
			toast.show('Failed to confirm booking', 'error');
		}
	});

	function confirm() {
		if (selectedSeatIds.length === 0) {
			selectionError = 'Select at least one seat to continue';
			return;
		}
		$confirmMutation.mutate();
	}
</script>

<section class="min-h-screen bg-app pb-28 sm:pb-32">
	<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
		<h1 class="text-[clamp(28px,4vw,40px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
			{$movie.data?.title}
		</h1>
		<p class="mt-2 text-[15px] text-ink-secondary">
			{$cinema.data?.name} &middot; {$hall.data?.name} &middot; {FormatParser.formatDateTime(
				$showtime.data?.startTime
			)}
		</p>
		<p class="mt-1 text-xs font-medium text-ink-muted">{$cinema.data?.address}</p>

		<div class="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
			<div class="card p-6 sm:p-8 lg:flex-1">
				<div class="mx-auto mb-10 w-full max-w-xs sm:max-w-sm">
					<div
						class="h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-ink-muted/40 to-transparent"
					></div>
					<p class="mt-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink-muted">
						Screen
					</p>
				</div>

				{#if $seats.isSuccess}
					<div class="flex flex-col items-center gap-2.5">
						{#each Object.keys(groupedByRow) as row}
							<div class="flex w-full items-center justify-center gap-3">
								<div class="w-6 shrink-0 text-right text-xs font-semibold text-ink-muted">{row}</div>
								<div class="flex flex-wrap justify-center gap-2">
									{#each groupedByRow[row] as seat}
										{@const isSelected = seat.id !== undefined && selectedSeatIds.includes(seat.id)}
										<button
											type="button"
											aria-label={`Seat ${row}${seat.seatNumber}${seat.isReserved ? ', reserved' : isSelected ? ', selected' : ', available'}`}
											aria-pressed={isSelected}
											onclick={() => toggleSeat(seat)}
											disabled={seat.isReserved}
											class="relative flex h-9 w-9 items-center justify-center rounded-xs text-xs font-semibold transition-all duration-fast {seat.isReserved
												? 'cursor-not-allowed border border-transparent bg-brand-charcoal text-white/80'
												: isSelected
													? 'scale-105 border-2 border-brand-gold bg-brand-gold text-on-accent shadow-soft'
													: 'border border-strong text-ink-secondary hover:border-brand-gold hover:text-ink'}"
										>
											{seat.seatNumber}
											{#if isSelected}
												<span
													class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-charcoal text-white"
												>
													<svg
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2.5"
														stroke-linecap="round"
														stroke-linejoin="round"
														class="h-2.5 w-2.5"
													>
														<polyline points="20 6 9 17 4 12"></polyline>
													</svg>
												</span>
											{/if}
										</button>
									{/each}
								</div>
								<div class="w-6 shrink-0 text-left text-xs font-semibold text-ink-muted">{row}</div>
							</div>
						{/each}
					</div>

					<div class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-ink-secondary">
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded-xs border border-strong"></span>
							Available
						</span>
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded-xs border-2 border-brand-gold bg-brand-gold"></span>
							Selected
						</span>
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded-xs bg-brand-charcoal"></span>
							Reserved
						</span>
					</div>
				{:else}
					<p class="py-10 text-center text-ink-muted">Loading seats...</p>
				{/if}
			</div>

			<aside class="card h-fit p-6 lg:w-80">
				<h2 class="text-[16px] font-semibold leading-[1.3] text-ink">Order summary</h2>
				<div class="mt-4 flex items-center justify-between text-[15px] text-ink-secondary">
					<span>Seats selected</span>
					<span class="font-medium text-ink">{selectedSeatIds.length}</span>
				</div>
				<div class="mt-2 flex items-center justify-between text-[15px] text-ink-secondary">
					<span>Price per seat</span>
					<span class="font-medium text-ink">${$showtime.data?.price ?? 0}</span>
				</div>
			</aside>
		</div>
	</div>

	<div class="bottom-action">
		<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
			<div>
				{#if selectionError}
					<p class="text-xs font-semibold text-brand-red">{selectionError}</p>
				{:else}
					<p class="text-xs font-medium uppercase tracking-wide text-ink-muted">Total</p>
				{/if}
				<p class="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink">${totalPrice}</p>
			</div>

			<button onclick={confirm} disabled={$confirmMutation.isPending} class="btn-primary">
				{$confirmMutation.isPending ? 'Confirming...' : 'Confirm booking'}
			</button>
		</div>
	</div>
</section>
