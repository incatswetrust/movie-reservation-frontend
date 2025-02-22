<script lang="ts">
    import type { PageData } from './$types'
	import CinemaViewForAdmin from '$lib/comps/cinemas/CinemaViewForAdmin.svelte';
    export let data: PageData;
</script>
<CinemaViewForAdmin Id={data.id}/>