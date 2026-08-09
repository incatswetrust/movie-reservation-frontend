<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { MovieCreateDto, MovieReadDto, MovieUpdateDto } from '../../../Api';
	import { api } from '../../../Module';
	import { toast } from '$lib/stores/toast';
	import { validateRequired, validateRange } from '$lib/tools/validators';

	let {
		IsOpenned = $bindable(false),
		movie = null
	}: { IsOpenned?: boolean; movie?: MovieReadDto | null } = $props();

	const ageRatings = ['0+', '6+', '12+', '16+', '18+'];

	function emptyForm(): MovieCreateDto {
		return {
			title: '',
			description: '',
			genre: '',
			duration: 90,
			releaseYear: new Date().getFullYear(),
			base64Image: '',
			director: '',
			cast: '',
			language: '',
			country: '',
			ageRating: '',
			trailerUrl: '',
			imdbRating: undefined,
			posterUrl: ''
		};
	}

	let form = $state<MovieCreateDto>(emptyForm());
	let posterPreview = $state<string | null>(null);

	let titleError = $state('');
	let durationError = $state('');
	let releaseYearError = $state('');
	let imdbRatingError = $state('');

	$effect(() => {
		if (!IsOpenned) return;

		if (movie) {
			form = {
				title: movie.title ?? '',
				description: movie.description ?? '',
				genre: movie.genre ?? '',
				duration: movie.duration ?? 90,
				releaseYear: movie.releaseYear ?? new Date().getFullYear(),
				base64Image: movie.base64Image ?? '',
				director: movie.director ?? '',
				cast: movie.cast ?? '',
				language: movie.language ?? '',
				country: movie.country ?? '',
				ageRating: movie.ageRating ?? '',
				trailerUrl: movie.trailerUrl ?? '',
				imdbRating: movie.imdbRating ?? undefined,
				posterUrl: movie.posterUrl ?? ''
			};
			posterPreview = movie.base64Image ?? null;
		} else {
			form = emptyForm();
			posterPreview = null;
		}

		titleError = '';
		durationError = '';
		releaseYearError = '';
		imdbRatingError = '';
	});

	const client = useQueryClient();

	const saveMutation = createMutation({
		mutationFn: async () => {
			if (movie?.id !== undefined) {
				const dto: MovieUpdateDto = { ...form };
				const response = await api.movies.moviesUpdate(movie.id, dto);
				return response.data;
			}
			const response = await api.movies.moviesCreate(form);
			return response.data;
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['movies'] });
			await client.invalidateQueries({ queryKey: ['movie'] });
			toast.show(movie ? 'Movie updated' : 'Movie added', 'success');
			IsOpenned = false;
		},
		onError: () => {
			toast.show('Failed to save movie', 'error');
		}
	});

	function validate(): boolean {
		titleError = validateRequired(form.title ?? '', 'Title');
		durationError = validateRange(form.duration, 1, 600, 'Duration');
		releaseYearError = validateRange(form.releaseYear, 1900, 2100, 'Release year');
		imdbRatingError =
			form.imdbRating !== undefined && form.imdbRating !== null
				? validateRange(form.imdbRating, 0, 10, 'IMDb rating')
				: '';

		return !titleError && !durationError && !releaseYearError && !imdbRatingError;
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		if (!file.type.match(/image\/(jpeg|png)/)) {
			toast.show('Acceptable formats: JPG, PNG', 'error');
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			posterPreview = reader.result as string;
			form.base64Image = posterPreview;
		};
		reader.readAsDataURL(file);
	}

	function submit() {
		if (!validate()) return;
		if (!movie && !posterPreview) {
			toast.show('Please choose a poster image', 'error');
			return;
		}
		$saveMutation.mutate();
	}

	function close() {
		IsOpenned = false;
	}
</script>

{#if IsOpenned}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	>
		<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-accent/20 bg-surface p-6">
			<h2 class="mb-4 text-xl font-bold text-text">
				{movie ? 'Edit movie' : 'New movie'}
			</h2>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<label for="title" class="mb-1 block text-sm text-text/70">Title</label>
					<input
						bind:value={form.title}
						id="title"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
					{#if titleError}<p class="mt-1 text-xs text-red-500">{titleError}</p>{/if}
				</div>

				<div>
					<label for="genre" class="mb-1 block text-sm text-text/70">Genre</label>
					<input
						bind:value={form.genre}
						id="genre"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="ageRating" class="mb-1 block text-sm text-text/70">Age rating</label>
					<select
						bind:value={form.ageRating}
						id="ageRating"
						class="w-full rounded border border-accent/30 bg-surface px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
					>
						<option value="">—</option>
						{#each ageRatings as rating}
							<option value={rating}>{rating}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="duration" class="mb-1 block text-sm text-text/70">Duration (min)</label>
					<input
						bind:value={form.duration}
						id="duration"
						type="number"
						min="1"
						max="600"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
					{#if durationError}<p class="mt-1 text-xs text-red-500">{durationError}</p>{/if}
				</div>

				<div>
					<label for="releaseYear" class="mb-1 block text-sm text-text/70">Release year</label>
					<input
						bind:value={form.releaseYear}
						id="releaseYear"
						type="number"
						min="1900"
						max="2100"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
					{#if releaseYearError}<p class="mt-1 text-xs text-red-500">{releaseYearError}</p>{/if}
				</div>

				<div>
					<label for="director" class="mb-1 block text-sm text-text/70">Director</label>
					<input
						bind:value={form.director}
						id="director"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="imdbRating" class="mb-1 block text-sm text-text/70">IMDb rating</label>
					<input
						bind:value={form.imdbRating}
						id="imdbRating"
						type="number"
						min="0"
						max="10"
						step="0.1"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
					{#if imdbRatingError}<p class="mt-1 text-xs text-red-500">{imdbRatingError}</p>{/if}
				</div>

				<div>
					<label for="language" class="mb-1 block text-sm text-text/70">Language</label>
					<input
						bind:value={form.language}
						id="language"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="country" class="mb-1 block text-sm text-text/70">Country</label>
					<input
						bind:value={form.country}
						id="country"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div class="sm:col-span-2">
					<label for="cast" class="mb-1 block text-sm text-text/70">Cast (comma-separated)</label>
					<input
						bind:value={form.cast}
						id="cast"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div class="sm:col-span-2">
					<label for="trailerUrl" class="mb-1 block text-sm text-text/70">Trailer URL (YouTube)</label>
					<input
						bind:value={form.trailerUrl}
						id="trailerUrl"
						type="text"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<div class="sm:col-span-2">
					<label for="description" class="mb-1 block text-sm text-text/70">Description</label>
					<textarea
						bind:value={form.description}
						id="description"
						rows="3"
						class="w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
					></textarea>
				</div>

				<div class="sm:col-span-2">
					<label class="mb-1 block text-sm text-text/70" for="poster-upload">Poster</label>
					<div class="flex items-center gap-4">
						{#if posterPreview}
							<img src={posterPreview} alt="Poster preview" class="h-24 w-16 rounded object-cover" />
						{/if}
						<label
							class="cursor-pointer rounded border border-dashed border-accent/40 px-4 py-2 text-sm text-text/70 transition-colors hover:border-accent"
						>
							<input
								id="poster-upload"
								type="file"
								hidden
								accept="image/jpeg, image/png"
								onchange={handleFileChange}
							/>
							Choose file
						</label>
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-end space-x-3">
				<button
					onclick={submit}
					disabled={$saveMutation.isPending}
					class="rounded bg-accent px-4 py-2 font-bold text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{movie ? 'Save' : 'Add'}
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
