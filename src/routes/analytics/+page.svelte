<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAdmin } from '$lib/tools/guards';
	import Analytics from '$lib/comps/analytics/Analytics.svelte';

	onMount(() => {
		requireAdmin();
	});
</script>

<Analytics />
