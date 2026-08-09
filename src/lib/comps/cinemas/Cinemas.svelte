<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import { type CinemaReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import NewCinema from './NewCinema.svelte';
	import CinemaCard from './CinemaCard.svelte';

	const client = useQueryClient();

	const cinemas = createQuery<CinemaReadDto[]>({
		queryKey: ['cinemas'],
		queryFn: async () => {
			const response: AxiosResponse<CinemaReadDto[]> = await api.cinemas.cinemasList();
			return response.data;
		}
	});

	const deleteMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.cinemas.cinemasDelete(id);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['cinemas'] });
		}
	});

	let isNewCinemaOpen = $state(false);

	function handleEdit(cinema: CinemaReadDto) {
		if (cinema.id !== undefined) void goto(`/cinemas/${cinema.id}`);
	}

	function handleDelete(cinema: CinemaReadDto) {
		if (cinema.id === undefined) return;
		if (confirm(`Delete "${cinema.name}"? This cannot be undone.`)) {
			$deleteMutation.mutate(cinema.id);
		}
	}
</script>

<section class="bg-primary">
	<div class="container mx-auto px-5 py-10">
		<div class="mb-10 flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 class="text-2xl font-semibold text-text sm:text-3xl">Cinemas</h1>
				<div class="mt-2 h-1 w-16 rounded bg-accent"></div>
				<p class="mt-3 text-text/70">Find a cinema near you and browse its halls.</p>
			</div>
			{#if $auth.isAdmin}
				<button
					onclick={() => (isNewCinemaOpen = true)}
					class="rounded-full bg-accent px-5 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-90"
				>
					+ Add cinema
				</button>
			{/if}
		</div>

		{#if $cinemas.isLoading}
			<p class="text-text/60">Loading cinemas...</p>
		{:else if $cinemas.isError}
			<p class="text-red-400">Failed to load cinemas.</p>
		{:else if $cinemas.data && $cinemas.data.length > 0}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each $cinemas.data as cinema (cinema.id)}
					<CinemaCard {cinema} isAdmin={$auth.isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
				{/each}
			</div>
		{:else}
			<p class="text-text/60">No cinemas yet.</p>
		{/if}
	</div>
</section>

<NewCinema bind:IsOpenned={isNewCinemaOpen} />
