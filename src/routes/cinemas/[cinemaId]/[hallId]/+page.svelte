<script lang="ts">
    import type { PageData } from './$types'
	import CinemaViewForAdmin from '$lib/comps/cinemas/CinemaViewForAdmin.svelte';
	import HallViewForAdmin from '$lib/comps/halls/HallViewForAdmin.svelte';
    export let data: PageData;
</script>

<HallViewForAdmin Id={data.id}/>