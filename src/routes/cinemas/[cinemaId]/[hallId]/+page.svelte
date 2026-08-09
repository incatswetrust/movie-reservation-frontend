<script lang="ts">
	import type { PageData } from './$types';
	import HallDetail from '$lib/comps/halls/HallDetail.svelte';

	export let data: PageData;
</script>

<HallDetail Id={data.id} />
