<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { HallCreateDto, HallReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { toast } from '$lib/stores/toast';
	import { validateRequired, validateRange } from '$lib/tools/validators';

	let {
		IsOpenned = $bindable(false),
		CinemaId
	}: { IsOpenned?: boolean; CinemaId: number } = $props();

	function emptyForm(): HallCreateDto {
		return { name: '', cinemaId: CinemaId, numberOfRows: 10, seatsPerRow: 10 };
	}

	let form = $state<HallCreateDto>(emptyForm());
	let nameError = $state('');
	let rowsError = $state('');
	let seatsError = $state('');

	$effect(() => {
		if (IsOpenned) {
			form = emptyForm();
			nameError = '';
			rowsError = '';
			seatsError = '';
		}
	});

	const client = useQueryClient();

	const addHallMutation = createMutation({
		mutationFn: async () => {
			const response = await api.halls.hallsCreate(form);
			return response.data as HallReadDto;
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['halls'] });
			toast.show('Hall added', 'success');
			IsOpenned = false;
		},
		onError: () => {
			toast.show('Failed to add hall', 'error');
		}
	});

	function validate(): boolean {
		nameError = validateRequired(form.name ?? '', 'Name');
		rowsError = validateRange(form.numberOfRows, 1, 50, 'Number of rows');
		seatsError = validateRange(form.seatsPerRow, 1, 50, 'Seats per row');
		return !nameError && !rowsError && !seatsError;
	}

	function submit() {
		if (!validate()) return;
		$addHallMutation.mutate();
	}

	function close() {
		IsOpenned = false;
	}
</script>

{#if IsOpenned}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-md border border-accent/20 bg-surface p-6">
			<h2 class="mb-4 text-xl font-bold text-text">New hall</h2>

			<label for="hall-name" class="mb-1 block text-sm text-text/70">Name</label>
			<input
				bind:value={form.name}
				id="hall-name"
				type="text"
				class="mb-1 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
			/>
			{#if nameError}<p class="mb-3 text-xs text-red-500">{nameError}</p>{:else}<div class="mb-3"></div>{/if}

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="hall-rows" class="mb-1 block text-sm text-text/70">Rows</label>
					<input
						bind:value={form.numberOfRows}
						id="hall-rows"
						type="number"
						min="1"
						max="50"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
					/>
					{#if rowsError}<p class="mt-1 text-xs text-red-500">{rowsError}</p>{/if}
				</div>
				<div>
					<label for="hall-seats" class="mb-1 block text-sm text-text/70">Seats per row</label>
					<input
						bind:value={form.seatsPerRow}
						id="hall-seats"
						type="number"
						min="1"
						max="50"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
					/>
					{#if seatsError}<p class="mt-1 text-xs text-red-500">{seatsError}</p>{/if}
				</div>
			</div>

			<div class="mt-6 flex justify-end space-x-3">
				<button
					onclick={submit}
					disabled={$addHallMutation.isPending}
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
