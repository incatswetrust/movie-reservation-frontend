<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { CinemaReadDto, CinemaUpdateDto, HallReadDto, ShowtimeReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import { validateRequired } from '$lib/tools/validators';
	import HallCard from '../halls/HallCard.svelte';
	import NewHall from '../halls/NewHall.svelte';

	let { Id }: { Id: number } = $props();

	const client = useQueryClient();

	const cinema = createQuery<CinemaReadDto>({
		queryKey: ['cinema', Id],
		queryFn: async () => {
			const response = await api.cinemas.cinemasDetail(Id);
			return response.data;
		}
	});

	const halls = createQuery<HallReadDto[]>({
		queryKey: ['halls', Id],
		queryFn: async () => {
			const response = await api.halls.hallsByCinemaDetail(Id);
			return response.data;
		}
	});

	const showtimes = createQuery<ShowtimeReadDto[]>({
		queryKey: ['showtimes'],
		queryFn: async () => {
			// Only used to count showtimes per hall client-side — ask for enough to cover it.
			const response = await api.showtimes.showtimesList({ page: 1, pageSize: 1000 });
			return response.data.items ?? [];
		}
	});

	function showtimeCount(hallId: number | undefined) {
		return ($showtimes.data ?? []).filter((st) => st.hallId === hallId).length;
	}

	let editMode = $state(false);
	let nameDraft = $state('');
	let addressDraft = $state('');
	let nameError = $state('');

	$effect(() => {
		if (!editMode && $cinema.data) {
			nameDraft = $cinema.data.name ?? '';
			addressDraft = $cinema.data.address ?? '';
		}
	});

	const updateMutation = createMutation({
		mutationFn: async () => {
			const dto: CinemaUpdateDto = { name: nameDraft, address: addressDraft };
			const response = await api.cinemas.cinemasUpdate(Id, dto);
			return response.data;
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['cinema', Id] });
			void client.invalidateQueries({ queryKey: ['cinemas'] });
			toast.show('Cinema updated', 'success');
			editMode = false;
		},
		onError: () => {
			toast.show('Failed to update cinema', 'error');
		}
	});

	function saveEdit() {
		nameError = validateRequired(nameDraft, 'Name');
		if (nameError) return;
		$updateMutation.mutate();
	}

	const deleteHallMutation = createMutation({
		mutationFn: async (hallId: number) => {
			await api.halls.hallsDelete(hallId);
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['halls', Id] });
			toast.show('Hall deleted', 'success');
		},
		onError: () => {
			toast.show('Failed to delete hall', 'error');
		}
	});

	function handleDeleteHall(hall: HallReadDto) {
		if (hall.id === undefined) return;
		if (confirm(`Delete "${hall.name}"? This cannot be undone.`)) {
			$deleteHallMutation.mutate(hall.id);
		}
	}

	let isNewHallOpen = $state(false);
</script>

{#if $cinema.isSuccess && $cinema.data}
	<section class="bg-app">
		<div class="container mx-auto px-5 py-10 sm:px-8 lg:px-10">
			<div class="mb-8 flex flex-wrap items-start justify-between gap-4">
				<div class="flex-1">
					{#if !editMode}
						<h1
							class="text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight text-ink"
						>
							{$cinema.data.name}
						</h1>
						<p class="mt-2 text-[15px] text-ink-secondary">{$cinema.data.address}</p>
					{:else}
						<div class="flex flex-col gap-3 sm:max-w-md">
							<div>
								<label for="cinema-name" class="mb-1 block text-sm text-ink-secondary">Name</label>
								<input id="cinema-name" bind:value={nameDraft} type="text" class="input" />
								{#if nameError}<p class="mt-1 text-xs text-brand-red">{nameError}</p>{/if}
							</div>
							<div>
								<label for="cinema-address" class="mb-1 block text-sm text-ink-secondary"
									>Address</label
								>
								<input id="cinema-address" bind:value={addressDraft} type="text" class="input" />
							</div>
						</div>
					{/if}
				</div>

				{#if $auth.isAdmin}
					{#if !editMode}
						<button onclick={() => (editMode = true)} class="btn-secondary">Edit</button>
					{:else}
						<div class="flex gap-2">
							<button
								onclick={saveEdit}
								disabled={$updateMutation.isPending}
								class="btn-primary"
							>
								Save
							</button>
							<button onclick={() => (editMode = false)} class="btn-secondary">Cancel</button>
						</div>
					{/if}
				{/if}
			</div>

			<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h2 class="text-xl font-bold text-ink">Halls</h2>
				{#if $auth.isAdmin}
					<button onclick={() => (isNewHallOpen = true)} class="btn-primary">+ Add hall</button>
				{/if}
			</div>

			{#if $halls.isLoading}
				<p class="text-ink-muted">Loading halls...</p>
			{:else if $halls.isError}
				<p class="text-brand-red">Failed to load halls.</p>
			{:else if $halls.data && $halls.data.length > 0}
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each $halls.data as hall (hall.id)}
						<HallCard
							{hall}
							showtimeCount={showtimeCount(hall.id)}
							isAdmin={$auth.isAdmin}
							onDelete={handleDeleteHall}
						/>
					{/each}
				</div>
			{:else}
				<p class="text-ink-muted">No halls yet.</p>
			{/if}
		</div>
	</section>

	<NewHall bind:IsOpenned={isNewHallOpen} CinemaId={Id} />
{/if}
