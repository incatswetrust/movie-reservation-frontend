<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { MovieReadDto, ShowtimeCreateDto, ShowtimeReadDto, ShowtimeUpdateDto } from '../../../Api';
	import { api } from '../../../Module';
	import { toast } from '$lib/stores/toast';
	import { validateRange } from '$lib/tools/validators';

	let {
		IsOpenned = $bindable(false),
		HallId,
		editingShowtime = $bindable(null)
	}: { IsOpenned?: boolean; HallId: number; editingShowtime?: ShowtimeReadDto | null } = $props();

	const isEditMode = $derived(editingShowtime !== null && editingShowtime !== undefined);

	function defaultStartTime(): string {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	}

	function toLocalInputValue(iso: string): string {
		const date = new Date(iso);
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
		return date.toISOString().slice(0, 16);
	}

	function emptyForm(): { movieId: number | undefined; startTime: string; price: number } {
		return { movieId: undefined, startTime: defaultStartTime(), price: 10 };
	}

	function formFromShowtime(showtime: ShowtimeReadDto): {
		movieId: number | undefined;
		startTime: string;
		price: number;
	} {
		return {
			movieId: showtime.movieId,
			startTime: showtime.startTime ? toLocalInputValue(showtime.startTime) : defaultStartTime(),
			price: showtime.price ?? 0
		};
	}

	let form = $state(emptyForm());
	let movieError = $state('');
	let priceError = $state('');

	$effect(() => {
		if (IsOpenned) {
			form = isEditMode && editingShowtime ? formFromShowtime(editingShowtime) : emptyForm();
			movieError = '';
			priceError = '';
		}
	});

	const movies = createQuery<MovieReadDto[]>({
		queryKey: ['movies'],
		queryFn: async () => {
			const response = await api.movies.moviesList({ page: 1, pageSize: 100 });
			return response.data.items ?? [];
		}
	});

	const client = useQueryClient();

	const addShowtimeMutation = createMutation({
		mutationFn: async () => {
			const dto: ShowtimeCreateDto = {
				hallId: HallId,
				movieId: form.movieId,
				startTime: new Date(form.startTime).toISOString(),
				price: form.price
			};
			const response = await api.showtimes.showtimesCreate(dto);
			return response.data;
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['showtimes'] });
			toast.show('Showtime added', 'success');
			close();
		},
		onError: () => {
			toast.show('Failed to add showtime', 'error');
		}
	});

	const updateShowtimeMutation = createMutation({
		mutationFn: async () => {
			const dto: ShowtimeUpdateDto = {
				startTime: new Date(form.startTime).toISOString(),
				price: form.price
			};
			const response = await api.showtimes.showtimesUpdate(editingShowtime?.id ?? 0, dto);
			return response.data;
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['showtimes'] });
			toast.show('Showtime updated', 'success');
			close();
		},
		onError: () => {
			toast.show('Failed to update showtime', 'error');
		}
	});

	function validate(): boolean {
		movieError = form.movieId === undefined ? 'Select a movie' : '';
		priceError = validateRange(form.price, 0, 10000, 'Price');
		return !movieError && !priceError;
	}

	function submit() {
		if (!validate()) return;
		if (isEditMode) {
			$updateShowtimeMutation.mutate();
		} else {
			$addShowtimeMutation.mutate();
		}
	}

	function close() {
		IsOpenned = false;
		editingShowtime = null;
	}
</script>

{#if IsOpenned}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
		<div class="card-floating w-full max-w-md p-6">
			<h2 class="mb-4 text-xl font-bold text-ink">{isEditMode ? 'Edit showtime' : 'New showtime'}</h2>

			<label for="showtime-movie" class="mb-1 block text-sm text-ink-secondary">Movie</label>
			<select bind:value={form.movieId} id="showtime-movie" class="input mb-1" disabled={isEditMode}>
				<option value={undefined} disabled>Choose a movie</option>
				{#if $movies.isSuccess}
					{#each $movies.data as movie}
						<option value={movie.id}>{movie.title}</option>
					{/each}
				{/if}
			</select>
			{#if isEditMode}
				<p class="mb-3 text-xs text-ink-muted">Movie cannot be changed on an existing showtime.</p>
			{:else if movieError}
				<p class="mb-3 text-xs text-brand-red">{movieError}</p>
			{:else}
				<div class="mb-3"></div>
			{/if}

			<label for="showtime-start" class="mb-1 block text-sm text-ink-secondary">Start time</label>
			<input bind:value={form.startTime} id="showtime-start" type="datetime-local" class="input mb-3" />

			<label for="showtime-price" class="mb-1 block text-sm text-ink-secondary">Price</label>
			<input
				bind:value={form.price}
				id="showtime-price"
				type="number"
				min="0"
				max="10000"
				step="0.01"
				class="input"
			/>
			{#if priceError}<p class="mt-1 text-xs text-brand-red">{priceError}</p>{/if}

			<div class="mt-6 flex justify-end gap-3">
				<button
					onclick={submit}
					disabled={$addShowtimeMutation.isPending || $updateShowtimeMutation.isPending}
					class="btn-primary"
				>
					{isEditMode ? 'Save' : 'Add'}
				</button>
				<button onclick={close} class="btn-secondary"> Cancel </button>
			</div>
		</div>
	</div>
{/if}
