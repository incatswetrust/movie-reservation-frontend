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
		<div class="card-floating w-full max-w-md p-6">
			<h2 class="mb-4 text-xl font-bold text-ink">New hall</h2>

			<label for="hall-name" class="mb-1 block text-sm text-ink-secondary">Name</label>
			<input bind:value={form.name} id="hall-name" type="text" class="input mb-1" />
			{#if nameError}<p class="mb-3 text-xs text-brand-red">{nameError}</p>{:else}<div
					class="mb-3"
				></div>{/if}

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="hall-rows" class="mb-1 block text-sm text-ink-secondary">Rows</label>
					<input
						bind:value={form.numberOfRows}
						id="hall-rows"
						type="number"
						min="1"
						max="50"
						class="input"
					/>
					{#if rowsError}<p class="mt-1 text-xs text-brand-red">{rowsError}</p>{/if}
				</div>
				<div>
					<label for="hall-seats" class="mb-1 block text-sm text-ink-secondary">Seats per row</label
					>
					<input
						bind:value={form.seatsPerRow}
						id="hall-seats"
						type="number"
						min="1"
						max="50"
						class="input"
					/>
					{#if seatsError}<p class="mt-1 text-xs text-brand-red">{seatsError}</p>{/if}
				</div>
			</div>

			<div class="mt-6 flex justify-end space-x-3">
				<button onclick={submit} disabled={$addHallMutation.isPending} class="btn-primary">
					Add
				</button>
				<button onclick={close} class="btn-secondary">Cancel</button>
			</div>
		</div>
	</div>
{/if}
