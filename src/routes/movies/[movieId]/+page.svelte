<script lang="ts">
	import type { PageData } from './$types';
	import MovieDetail from '$lib/comps/movies/MovieDetail.svelte';

	export let data: PageData;
</script>

<MovieDetail Id={data.id} />
