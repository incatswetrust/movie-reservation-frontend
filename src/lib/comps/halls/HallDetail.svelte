<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import type {
		HallImageCreateDto,
		HallImageReadDto,
		HallReadDto,
		HallUpdateDto,
		SeatReadDto
	} from '../../../Api';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import ShowTimeByHallTable from '../showtimes/ShowTimeByHallTable.svelte';

	let { Id }: { Id: number } = $props();

	const client = useQueryClient();

	const hall = createQuery<HallReadDto>({
		queryKey: ['hall', Id],
		queryFn: async () => {
			const response: AxiosResponse<HallReadDto> = await api.halls.hallsDetail(Id);
			return response.data;
		}
	});

	const images = createQuery<HallImageReadDto[]>({
		queryKey: ['hall-images', Id],
		queryFn: async () => {
			const response: AxiosResponse<HallImageReadDto[]> = await api.halls.hallsImagesList(Id);
			return response.data;
		}
	});

	let editNameMode = $state(false);
	let hallNameDraft = $state('');

	$effect(() => {
		if ($hall.data?.name !== undefined && $hall.data?.name !== null) {
			hallNameDraft = $hall.data.name;
		}
	});

	const updateMutation = createMutation({
		mutationFn: async () => {
			const payload: HallUpdateDto = { name: hallNameDraft, cinemaId: $hall.data?.cinemaId };
			const response: AxiosResponse<HallReadDto> = await api.halls.hallsUpdate(Id, payload);
			return response.data;
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['hall', Id] });
			editNameMode = false;
		}
	});

	const uploadMutation = createMutation({
		mutationFn: async (data: HallImageCreateDto) => {
			const response: AxiosResponse<HallImageReadDto> = await api.halls.hallsImagesCreate(
				Id,
				data
			);
			return response.data;
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['hall-images', Id] });
			imageUrlDraft = '';
			imageFileBase64 = null;
		}
	});

	const deleteImageMutation = createMutation({
		mutationFn: async (imageId: number) => {
			await api.halls.hallsImagesDelete(Id, imageId);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['hall-images', Id] });
		}
	});

	let imageUrlDraft = $state('');
	let imageFileBase64 = $state<string | null>(null);

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		if (!file.type.match(/image\/(jpeg|png|webp)/)) {
			alert('Acceptable formats: JPG, PNG, WEBP');
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			imageFileBase64 = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	function uploadImage() {
		if (imageFileBase64) {
			$uploadMutation.mutate({ base64Image: imageFileBase64 });
		} else if (imageUrlDraft.trim().length > 0) {
			$uploadMutation.mutate({ url: imageUrlDraft.trim() });
		}
	}

	function deleteImage(imageId: number | undefined) {
		if (imageId === undefined) return;
		if (confirm('Delete this image?')) {
			$deleteImageMutation.mutate(imageId);
		}
	}

	const groupedByRow = $derived(
		($hall.data?.seats ?? []).reduce(
			(acc, seat) => {
				if (seat.rowLabel !== null && seat.rowLabel !== undefined) {
					(acc[seat.rowLabel] ??= []).push(seat);
				}
				return acc;
			},
			{} as Record<string, SeatReadDto[]>
		)
	);
</script>

{#if $hall.isSuccess && $hall.data}
	<div class="mx-auto max-w-5xl px-5 py-10">
		<div class="mb-2 flex flex-wrap items-center gap-2">
			{#if !editNameMode}
				<h1 class="text-2xl font-semibold text-text sm:text-3xl">{$hall.data.name}</h1>
				{#if $auth.isAdmin}
					<button
						aria-label="Edit hall name"
						onclick={() => (editNameMode = true)}
						class="rounded-full p-1.5 text-text/60 transition-colors hover:text-accent"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<path d="M12 20h9" />
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
						</svg>
					</button>
				{/if}
			{:else}
				<input
					bind:value={hallNameDraft}
					type="text"
					class="rounded border border-accent/30 bg-transparent px-3 py-1.5 text-text focus:border-accent focus:outline-none"
				/>
				<button
					onclick={() => $updateMutation.mutate()}
					class="rounded bg-accent px-3 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
				>
					Save
				</button>
				<button
					onclick={() => (editNameMode = false)}
					class="rounded border border-accent/30 px-3 py-1.5 text-sm text-text transition-colors hover:bg-accent/10"
				>
					Cancel
				</button>
			{/if}
		</div>
		<div class="mb-8 h-1 w-16 rounded bg-accent"></div>
		<p class="mb-8 text-text/70">{$hall.data.seats?.length ?? 0} seats</p>

		<!-- Gallery -->
		<section class="mb-10">
			<h2 class="mb-3 text-lg font-semibold text-text">Gallery</h2>
			{#if $images.isLoading}
				<p class="text-sm text-text/60">Loading images...</p>
			{:else if $images.data && $images.data.length > 0}
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{#each $images.data as image (image.id)}
						<div class="group relative aspect-video overflow-hidden rounded-lg bg-primary">
							<img
								src={image.url ?? undefined}
								alt={$hall.data.name ?? 'Hall'}
								class="h-full w-full object-cover"
							/>
							{#if $auth.isAdmin}
								<button
									aria-label="Delete image"
									onclick={() => deleteImage(image.id)}
									class="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="h-4 w-4"
									>
										<path d="M3 6h18" />
										<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
										<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
										<path d="M10 11v6M14 11v6" />
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-text/60">No images yet.</p>
			{/if}

			{#if $auth.isAdmin}
				<div class="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-accent/10 bg-surface p-4">
					<div class="min-w-[200px] flex-1">
						<label for="image-url" class="mb-1 block text-xs text-text/60">Image URL</label>
						<input
							id="image-url"
							bind:value={imageUrlDraft}
							type="text"
							placeholder="https://..."
							class="w-full rounded border border-accent/30 bg-transparent px-3 py-1.5 text-sm text-text placeholder-text/40 focus:border-accent focus:outline-none"
						/>
					</div>
					<label
						class="cursor-pointer rounded border border-dashed border-accent/40 px-3 py-1.5 text-sm text-text/70 transition-colors hover:border-accent"
					>
						<input
							type="file"
							hidden
							accept="image/jpeg, image/png, image/webp"
							onchange={handleFileChange}
						/>
						{imageFileBase64 ? 'File selected' : 'Choose file'}
					</label>
					<button
						onclick={uploadImage}
						class="rounded bg-accent px-4 py-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
					>
						Upload
					</button>
				</div>
			{/if}
		</section>

		<!-- Seat plan -->
		<section class="mb-10">
			<div
				class="flex items-center py-3 text-sm uppercase tracking-wide text-text/50 before:me-6 before:flex-1 before:border-2 before:border-accent/30 after:ms-6 after:flex-1 after:border-2 after:border-accent/30"
			>
				Screen
			</div>

			{#each Object.keys(groupedByRow) as row}
				<div class="mb-2 flex items-center">
					<div class="mr-4 flex w-6 justify-end font-bold text-text/50">{row}</div>
					<div class="flex flex-1 justify-between">
						{#each groupedByRow[row] as seat}
							<div
								class="flex h-8 w-8 items-center justify-center border border-accent/30 text-sm text-text/70"
							>
								{seat.seatNumber}
							</div>
						{/each}
					</div>
				</div>
			{/each}
			<div class="py-3 before:flex-1 before:border-2 before:border-accent/30 after:flex-1 after:border-2 after:border-accent/30"></div>
		</section>

		<ShowTimeByHallTable HallId={Id} />
	</div>
{/if}
