<script lang="ts">
	import type { PageData } from './$types';
	import CinemaDetail from '$lib/comps/cinemas/CinemaDetail.svelte';

	export let data: PageData;
</script>

<CinemaDetail Id={data.id} />
