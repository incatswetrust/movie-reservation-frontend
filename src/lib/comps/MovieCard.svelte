<script lang="ts">
	import { type MovieReadDto } from '../../Api';
	import { FormatParser } from '$lib/tools/FormatParser';

	let {
		movie,
		isAdmin = false,
		onEdit,
		onDelete
	}: {
		movie: MovieReadDto;
		isAdmin?: boolean;
		onEdit?: (movie: MovieReadDto) => void;
		onDelete?: (movie: MovieReadDto) => void;
	} = $props();
</script>

<a
	href={`/movies/${movie.id}`}
	class="group relative block aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-surface shadow-card transition-all duration-fast hover:-translate-y-0.5 hover:shadow-floating"
>
	<img
		src={movie.posterUrl || movie.base64Image || undefined}
		alt={movie.title ?? 'Movie poster'}
		class="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
	/>

	{#if movie.imdbRating}
		<span
			class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-subtle bg-elevated/90 px-2 py-0.5 text-xs font-semibold text-brand-gold shadow-soft backdrop-blur-sm"
		>
			★ {movie.imdbRating}
		</span>
	{/if}

	{#if isAdmin}
		<div class="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-fast group-hover:opacity-100">
			<button
				aria-label="Edit movie"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onEdit?.(movie);
				}}
				class="rounded-full border border-subtle bg-elevated/90 p-1.5 text-ink shadow-soft backdrop-blur-sm transition-colors duration-fast hover:text-brand-gold"
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
			<button
				aria-label="Delete movie"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete?.(movie);
				}}
				class="rounded-full border border-subtle bg-elevated/90 p-1.5 text-ink shadow-soft backdrop-blur-sm transition-colors duration-fast hover:text-brand-red"
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
		</div>
	{/if}

	<div class="media-overlay absolute inset-0 flex flex-col justify-end p-4">
		<h3 class="truncate font-semibold text-white">{movie.title}</h3>
		<p class="truncate text-xs text-white/80">
			{movie.releaseYear} &middot; {movie.genre} &middot; {FormatParser.formatMinutesToHours(movie.duration)}
		</p>
	</div>
</a>
