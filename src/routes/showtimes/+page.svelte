<script lang="ts">
	import AllShowtimes from '$lib/comps/showtimes/AllShowtimes.svelte';
</script>

<section class="bg-primary">
	<div class="container mx-auto px-5 py-10">
		<h1 class="text-2xl font-semibold text-text sm:text-3xl">Showtimes</h1>
		<div class="mt-2 h-1 w-16 rounded bg-accent"></div>
		<p class="mt-3 mb-8 text-text/70">Find a screening by date or cinema.</p>

		<AllShowtimes />
	</div>
</section>
