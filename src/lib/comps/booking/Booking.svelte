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

<section class="bg-primary">
	<div class="container mx-auto px-5 py-10">
		<h1 class="text-2xl font-semibold text-text sm:text-3xl">{$movie.data?.title}</h1>
		<p class="mt-2 text-text/70">
			{$cinema.data?.name} &middot; {$hall.data?.name} &middot; {FormatParser.formatDateTime(
				$showtime.data?.startTime
			)}
		</p>
		<p class="text-sm text-text/50">{$cinema.data?.address}</p>

		<div class="mt-8 flex flex-col gap-8 lg:flex-row">
			<div class="rounded-lg border border-accent/15 bg-surface p-6 lg:flex-1">
				<div
					class="mb-8 py-3 text-center text-xs uppercase tracking-widest text-text/50 before:mr-6 before:inline-block before:w-1/4 before:border-t before:border-accent/30 after:ml-6 after:inline-block after:w-1/4 after:border-t after:border-accent/30"
				>
					Screen
				</div>

				{#if $seats.isSuccess}
					<div class="flex flex-col items-center gap-2">
						{#each Object.keys(groupedByRow) as row}
							<div class="flex w-full items-center justify-center gap-3">
								<div class="w-6 text-right text-sm font-semibold text-text/50">{row}</div>
								<div class="flex flex-wrap justify-center gap-2">
									{#each groupedByRow[row] as seat}
										{@const isSelected = seat.id !== undefined && selectedSeatIds.includes(seat.id)}
										<button
											aria-label={`Seat ${row}${seat.seatNumber}`}
											onclick={() => toggleSeat(seat)}
											disabled={seat.isReserved}
											class="flex h-8 w-8 items-center justify-center rounded border text-xs font-medium transition-colors {seat.isReserved
												? 'cursor-not-allowed border-red-500/40 bg-red-500/15 text-red-400'
												: isSelected
													? 'border-accent bg-accent text-primary'
													: 'border-accent/30 text-text hover:border-accent'}"
										>
											{seat.seatNumber}
										</button>
									{/each}
								</div>
								<div class="w-6 text-left text-sm font-semibold text-text/50">{row}</div>
							</div>
						{/each}
					</div>

					<div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text/70">
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded border border-accent/30"></span>
							Available
						</span>
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded bg-accent"></span>
							Selected
						</span>
						<span class="flex items-center gap-2">
							<span class="h-4 w-4 rounded border border-red-500/40 bg-red-500/15"></span>
							Booked
						</span>
					</div>
				{:else}
					<p class="text-text/60">Loading seats...</p>
				{/if}
			</div>

			<div class="h-fit rounded-lg border border-accent/15 bg-surface p-6 lg:w-80">
				<h2 class="mb-4 text-lg font-semibold text-text">Order summary</h2>
				<div class="flex items-center justify-between text-sm text-text/70">
					<span>Seats selected</span>
					<span class="text-text">{selectedSeatIds.length}</span>
				</div>
				<div class="mt-2 flex items-center justify-between text-sm text-text/70">
					<span>Price per seat</span>
					<span class="text-text">${$showtime.data?.price ?? 0}</span>
				</div>
				<div class="mt-4 flex items-center justify-between border-t border-accent/15 pt-4 text-base font-semibold">
					<span class="text-text">Total</span>
					<span class="text-accent">${totalPrice}</span>
				</div>

				{#if selectionError}
					<p class="mt-3 text-sm text-red-400">{selectionError}</p>
				{/if}

				<button
					onclick={confirm}
					disabled={$confirmMutation.isPending}
					class="mt-6 w-full rounded-full bg-accent px-4 py-2.5 font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{$confirmMutation.isPending ? 'Confirming...' : 'Confirm booking'}
				</button>
			</div>
		</div>
	</div>
</section>
