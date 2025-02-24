<script lang="ts">
    import type { PageData } from './$types'
	import MovieViewForAdmin from '$lib/comps/movies/MovieViewForAdmin.svelte';
    export let data: PageData;
</script>

<MovieViewForAdmin Id={data.id}/>