<script lang="ts">
	import { type MovieReadDto } from '../../Api';
	import { FormatParser } from '$lib/tools/FormatParser';

	let { movie }: { movie: MovieReadDto } = $props();
</script>

<a
	href={`/movies/${movie.id}`}
	class="group relative block aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-surface"
>
	<img
		src={movie.base64Image ?? undefined}
		alt={movie.title ?? 'Movie poster'}
		class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
	/>
	<div
		class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	>
		<h3 class="font-semibold text-white">{movie.title}</h3>
		<p class="text-xs text-white/80">
			{movie.releaseYear} &middot; {movie.genre} &middot; {FormatParser.formatMinutesToHours(movie.duration)}
		</p>
	</div>
</a>
