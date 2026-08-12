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
	import { compressImageDataUrl } from '$lib/tools/imageCompression';
	import ShowTimeByHallTable from '../showtimes/ShowTimeByHallTable.svelte';
	import HallGallery from '../HallGallery.svelte';

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
		reader.onload = async () => {
			imageFileBase64 = await compressImageDataUrl(reader.result as string);
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
	<div class="mx-auto max-w-5xl px-5 py-10 sm:px-8">
		<div class="mb-2 flex flex-wrap items-center gap-2">
			{#if !editNameMode}
				<h1 class="text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight text-ink">
					{$hall.data.name}
				</h1>
				{#if $auth.isAdmin}
					<button
						aria-label="Edit hall name"
						onclick={() => (editNameMode = true)}
						class="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors duration-fast hover:text-ink"
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
				<input bind:value={hallNameDraft} type="text" class="input max-w-xs" />
				<button onclick={() => $updateMutation.mutate()} class="btn-primary">Save</button>
				<button onclick={() => (editNameMode = false)} class="btn-secondary">Cancel</button>
			{/if}
		</div>
		<div class="mb-8 h-1 w-16 rounded-full bg-brand-gold"></div>
		<p class="mb-8 text-[15px] text-ink-secondary">{$hall.data.seats?.length ?? 0} seats</p>

		<!-- Gallery -->
		<section class="mb-10">
			<h2 class="mb-3 text-xl font-bold text-ink">Gallery</h2>
			{#if $images.isLoading}
				<p class="text-sm text-ink-muted">Loading images...</p>
			{:else}
				<HallGallery
					images={$images.data ?? []}
					isAdmin={$auth.isAdmin}
					onDelete={deleteImage}
					altText={$hall.data.name ?? 'Hall'}
				/>
			{/if}

			{#if $auth.isAdmin}
				<div class="card mt-4 flex flex-wrap items-end gap-3 p-4">
					<div class="min-w-[200px] flex-1">
						<label for="image-url" class="mb-1 block text-xs font-medium text-ink-muted"
							>Image URL</label
						>
						<input
							id="image-url"
							bind:value={imageUrlDraft}
							type="text"
							placeholder="https://..."
							class="input"
						/>
					</div>
					<label
						class="flex min-h-[48px] cursor-pointer items-center rounded-2xl border border-dashed border-strong px-4 text-sm text-ink-secondary transition-colors duration-fast hover:border-brand-gold"
					>
						<input
							type="file"
							hidden
							accept="image/jpeg, image/png, image/webp"
							onchange={handleFileChange}
						/>
						{imageFileBase64 ? 'File selected' : 'Choose file'}
					</label>
					<button onclick={uploadImage} class="btn-primary">Upload</button>
				</div>
			{/if}
		</section>

		<!-- Seat plan -->
		<section class="mb-10">
			<div
				class="flex items-center py-3 text-xs font-medium uppercase tracking-wide text-ink-muted before:me-6 before:flex-1 before:border-t-2 before:border-subtle after:ms-6 after:flex-1 after:border-t-2 after:border-subtle"
			>
				Screen
			</div>

			{#each Object.keys(groupedByRow) as row}
				<div class="mb-2 flex items-center">
					<div class="mr-4 flex w-6 justify-end text-sm font-bold text-ink-muted">{row}</div>
					<div class="flex flex-1 justify-between">
						{#each groupedByRow[row] as seat}
							<div
								class="flex h-8 w-8 items-center justify-center rounded-sm border text-xs font-medium transition-colors duration-fast {seat.isReserved
									? 'border-ink/10 bg-ink text-app'
									: 'border-dashed border-subtle text-ink-secondary'}"
								title={seat.isReserved ? 'Reserved' : 'Available'}
							>
								{seat.seatNumber}
							</div>
						{/each}
					</div>
				</div>
			{/each}
			<div
				class="py-3 before:flex-1 before:border-t-2 before:border-subtle after:flex-1 after:border-t-2 after:border-subtle"
			></div>
		</section>

		<ShowTimeByHallTable HallId={Id} />
	</div>
{/if}
