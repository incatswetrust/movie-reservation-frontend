<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { BookingReadDto, ShowtimeReadDto, UserUpdateDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { validateRequired } from '$lib/tools/validators';
	import { FormatParser } from '$lib/tools/FormatParser';

	const client = useQueryClient();

	const bookings = createQuery<BookingReadDto[]>({
		queryKey: ['bookings', 'my'],
		queryFn: async () => {
			const response = await api.bookings.bookingsMyList();
			return response.data;
		}
	});

	let showtimesById = $state<Record<number, ShowtimeReadDto>>({});

	$effect(() => {
		const ids = [
			...new Set(
				($bookings.data ?? [])
					.map((b) => b.showtimeId)
					.filter((id): id is number => id !== undefined)
			)
		];
		const missing = ids.filter((id) => !(id in showtimesById));
		if (missing.length === 0) return;

		Promise.all(
			missing.map((id) => api.showtimes.showtimesDetail(id).then((r) => [id, r.data] as const))
		).then((entries) => {
			showtimesById = { ...showtimesById, ...Object.fromEntries(entries) };
		});
	});

	const cancelMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.bookings.bookingsCancelCreate(id);
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['bookings', 'my'] });
			toast.show('Booking canceled', 'success');
		},
		onError: () => {
			toast.show('Failed to cancel booking', 'error');
		}
	});

	function cancelBooking(booking: BookingReadDto) {
		if (booking.id === undefined) return;
		if (confirm('Cancel this booking?')) {
			$cancelMutation.mutate(booking.id);
		}
	}

	let username = $state($auth.user?.username ?? '');
	let email = $state($auth.user?.email ?? '');
	let usernameError = $state('');

	$effect(() => {
		username = $auth.user?.username ?? '';
		email = $auth.user?.email ?? '';
	});

	const updateProfileMutation = createMutation({
		mutationFn: async () => {
			const dto: UserUpdateDto = { username, email: email || null };
			const response = await api.auth.authProfileUpdate(dto);
			return response.data;
		},
		onSuccess: (data) => {
			auth.setUser(data);
			toast.show('Profile updated', 'success');
		},
		onError: () => {
			toast.show('Failed to update profile', 'error');
		}
	});

	function saveProfile() {
		usernameError = validateRequired(username, 'Username');
		if (usernameError) return;
		$updateProfileMutation.mutate();
	}

	function statusLabel(status: string | null | undefined) {
		return status ?? 'Active';
	}
</script>

<section class="bg-primary">
	<div class="container mx-auto px-5 py-10">
		<h1 class="text-2xl font-semibold text-text sm:text-3xl">Profile</h1>
		<div class="mt-2 h-1 w-16 rounded bg-accent"></div>

		<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="rounded-lg border border-accent/15 bg-surface p-6 lg:col-span-1">
				<h2 class="mb-4 text-lg font-semibold text-text">Account details</h2>

				<div class="flex flex-col gap-4">
					<div>
						<label for="username" class="mb-1 block text-sm text-text/70">Username</label>
						<input
							id="username"
							type="text"
							bind:value={username}
							class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
						/>
						{#if usernameError}<p class="mt-1 text-xs text-red-500">{usernameError}</p>{/if}
					</div>

					<div>
						<label for="email" class="mb-1 block text-sm text-text/70">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
						/>
					</div>

					<button
						onclick={saveProfile}
						disabled={$updateProfileMutation.isPending}
						class="mt-2 rounded-full bg-accent px-4 py-2 font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{$updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
					</button>
				</div>
			</div>

			<div class="rounded-lg border border-accent/15 bg-surface p-6 lg:col-span-2">
				<h2 class="mb-4 text-lg font-semibold text-text">My bookings</h2>

				{#if $bookings.isLoading}
					<p class="text-text/60">Loading bookings...</p>
				{:else if $bookings.isError}
					<p class="text-red-400">Failed to load bookings.</p>
				{:else if $bookings.data && $bookings.data.length > 0}
					<div class="flex flex-col divide-y divide-accent/10">
						{#each $bookings.data as booking (booking.id)}
							{@const st = booking.showtimeId !== undefined ? showtimesById[booking.showtimeId] : undefined}
							<div class="flex flex-wrap items-center justify-between gap-3 py-3">
								<div>
									<p class="text-text">{st?.movieName ?? `Booking #${booking.id}`}</p>
									<p class="text-sm text-text/60">
										{#if st}
											{st.cinemaName} &middot; {st.hallName} &middot; {FormatParser.formatDateTime(st.startTime)}
										{/if}
									</p>
									<p class="text-xs text-text/50">
										Status: {statusLabel(booking.status)} &middot; ${booking.totalPrice}
									</p>
								</div>
								{#if booking.status !== 'Canceled'}
									<button
										onclick={() => cancelBooking(booking)}
										class="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
									>
										Cancel
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-text/60">You have no bookings yet.</p>
				{/if}
			</div>
		</div>
	</div>
</section>
