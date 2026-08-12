<script lang="ts">
	import AllShowtimes from '$lib/comps/showtimes/AllShowtimes.svelte';
</script>

<section class="bg-app">
	<div class="container mx-auto px-5 py-10">
		<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Showtimes</h1>
		<div class="mt-2 h-1 w-16 rounded-full bg-brand-gold"></div>
		<p class="mt-3 mb-8 text-ink-secondary">Find a screening by date or cinema.</p>

		<AllShowtimes />
	</div>
</section>
