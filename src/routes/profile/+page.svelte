<script lang="ts">
	import { onMount } from 'svelte';
	import Profile from '$lib/comps/user/Profile.svelte';
	import { requireAuth } from '$lib/tools/guards';

	let isReady = $state(false);

	onMount(async () => {
		isReady = await requireAuth();
	});
</script>

{#if isReady}
	<Profile />
{/if}
