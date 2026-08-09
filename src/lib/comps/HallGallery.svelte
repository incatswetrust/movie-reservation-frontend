<script lang="ts">
	let {
		images,
		altText = 'Hall image',
		isAdmin = false,
		onDelete
	}: {
		images: { id?: number; url?: string | null }[];
		altText?: string;
		isAdmin?: boolean;
		onDelete?: (id: number) => void;
	} = $props();

	let trackEl: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);

	function scrollToIndex(index: number) {
		if (!trackEl) return;
		const clamped = Math.max(0, Math.min(index, images.length - 1));
		const child = trackEl.children[clamped] as HTMLElement | undefined;
		child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
		activeIndex = clamped;
	}

	function prev() {
		scrollToIndex(activeIndex - 1);
	}

	function next() {
		scrollToIndex(activeIndex + 1);
	}

	function handleScroll() {
		if (!trackEl) return;
		const { scrollLeft, clientWidth } = trackEl;
		if (clientWidth > 0) {
			activeIndex = Math.round(scrollLeft / clientWidth);
		}
	}
</script>

{#if images.length > 0}
	<div class="relative">
		<div
			bind:this={trackEl}
			onscroll={handleScroll}
			class="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each images as image, i (image.id ?? i)}
				<div
					class="group relative aspect-video w-full shrink-0 snap-start overflow-hidden rounded-lg bg-primary"
				>
					<img src={image.url ?? undefined} alt={altText} class="h-full w-full object-cover" />
					{#if isAdmin && image.id !== undefined}
						<button
							aria-label="Delete image"
							onclick={() => onDelete?.(image.id as number)}
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

		{#if images.length > 1}
			<button
				aria-label="Previous image"
				onclick={prev}
				class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
			>
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
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>
			<button
				aria-label="Next image"
				onclick={next}
				class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
			>
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
					<path d="M9 18l6-6-6-6" />
				</svg>
			</button>
			<div class="mt-3 flex justify-center gap-1.5">
				{#each images as _, i}
					<button
						aria-label={`Go to image ${i + 1}`}
						onclick={() => scrollToIndex(i)}
						class="h-1.5 rounded-full transition-all {i === activeIndex
							? 'w-5 bg-accent'
							: 'w-1.5 bg-accent/30'}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<p class="text-sm text-text/60">No images yet.</p>
{/if}
