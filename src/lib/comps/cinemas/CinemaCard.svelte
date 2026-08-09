<script lang="ts">
	import type { CinemaReadDto } from '../../../Api';

	let {
		cinema,
		isAdmin = false,
		onEdit,
		onDelete
	}: {
		cinema: CinemaReadDto;
		isAdmin?: boolean;
		onEdit?: (cinema: CinemaReadDto) => void;
		onDelete?: (cinema: CinemaReadDto) => void;
	} = $props();
</script>

<div
	class="group relative flex flex-col rounded-lg border border-accent/10 bg-surface p-5 transition-colors hover:border-accent/40"
>
	<a href={`/cinemas/${cinema.id}`} class="flex flex-1 flex-col gap-2">
		<div class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-5 w-5"
			>
				<rect x="4" y="3" width="16" height="18" rx="1" />
				<path d="M9 21v-4h6v4M9 7h.01M9 11h.01M9 15h.01M15 7h.01M15 11h.01M15 15h.01" />
			</svg>
		</div>
		<h3 class="text-lg font-semibold text-text">{cinema.name}</h3>
		<p class="text-sm text-text/70">{cinema.address}</p>
		<span class="mt-2 inline-flex items-center gap-1 text-sm text-accent">
			View halls
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
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</span>
	</a>

	{#if isAdmin}
		<div class="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
			<button
				aria-label="Edit cinema"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onEdit?.(cinema);
				}}
				class="rounded-full bg-primary/80 p-1.5 text-text transition-colors hover:text-accent"
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
				aria-label="Delete cinema"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete?.(cinema);
				}}
				class="rounded-full bg-primary/80 p-1.5 text-text transition-colors hover:text-red-400"
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
</div>
