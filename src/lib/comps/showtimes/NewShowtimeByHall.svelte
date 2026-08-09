<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { MovieReadDto, ShowtimeCreateDto } from '../../../Api';
	import { api } from '../../../Module';
	import { toast } from '$lib/stores/toast';
	import { validateRange } from '$lib/tools/validators';

	let { IsOpenned = $bindable(false), HallId }: { IsOpenned?: boolean; HallId: number } = $props();

	function defaultStartTime(): string {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	}

	function emptyForm(): { movieId: number | undefined; startTime: string; price: number } {
		return { movieId: undefined, startTime: defaultStartTime(), price: 10 };
	}

	let form = $state(emptyForm());
	let movieError = $state('');
	let priceError = $state('');

	$effect(() => {
		if (IsOpenned) {
			form = emptyForm();
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
			IsOpenned = false;
		},
		onError: () => {
			toast.show('Failed to add showtime', 'error');
		}
	});

	function validate(): boolean {
		movieError = form.movieId === undefined ? 'Select a movie' : '';
		priceError = validateRange(form.price, 0, 10000, 'Price');
		return !movieError && !priceError;
	}

	function submit() {
		if (!validate()) return;
		$addShowtimeMutation.mutate();
	}

	function close() {
		IsOpenned = false;
	}
</script>

{#if IsOpenned}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-md border border-accent/20 bg-surface p-6">
			<h2 class="mb-4 text-xl font-bold text-text">New showtime</h2>

			<label for="showtime-movie" class="mb-1 block text-sm text-text/70">Movie</label>
			<select
				bind:value={form.movieId}
				id="showtime-movie"
				class="mb-1 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
			>
				<option value={undefined} disabled>Choose a movie</option>
				{#if $movies.isSuccess}
					{#each $movies.data as movie}
						<option value={movie.id}>{movie.title}</option>
					{/each}
				{/if}
			</select>
			{#if movieError}<p class="mb-3 text-xs text-red-500">{movieError}</p>{:else}<div class="mb-3"></div>{/if}

			<label for="showtime-start" class="mb-1 block text-sm text-text/70">Start time</label>
			<input
				bind:value={form.startTime}
				id="showtime-start"
				type="datetime-local"
				class="mb-3 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
			/>

			<label for="showtime-price" class="mb-1 block text-sm text-text/70">Price</label>
			<input
				bind:value={form.price}
				id="showtime-price"
				type="number"
				min="0"
				max="10000"
				step="0.01"
				class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
			/>
			{#if priceError}<p class="mt-1 text-xs text-red-500">{priceError}</p>{/if}

			<div class="mt-6 flex justify-end space-x-3">
				<button
					onclick={submit}
					disabled={$addShowtimeMutation.isPending}
					class="rounded bg-accent px-4 py-2 font-bold text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					Add
				</button>
				<button
					onclick={close}
					class="rounded border border-accent/40 px-4 py-2 text-text transition-colors hover:bg-accent/10"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
