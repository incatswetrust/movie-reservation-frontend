<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:items-end"
>
	{#each $toast as item (item.id)}
		<div
			transition:fly={{ y: 16, duration: 200 }}
			class="card-floating pointer-events-auto flex w-full max-w-sm items-center gap-3 border-l-4 px-4 py-3 text-sm text-ink {item.type ===
			'error'
				? 'border-brand-red'
				: 'border-brand-gold'}"
		>
			{#if item.type === 'error'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5 shrink-0 text-brand-red"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 8v5M12 16h.01" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5 shrink-0 text-brand-gold"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="m8.5 12.5 2.5 2.5 4.5-5" />
				</svg>
			{/if}
			<span class="flex-1 text-ink-secondary">{item.message}</span>
			<button
				aria-label="Dismiss notification"
				onclick={() => toast.dismiss(item.id)}
				class="text-ink-muted transition-colors duration-fast hover:text-ink"
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
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/each}
</div>
