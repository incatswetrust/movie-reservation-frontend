<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Booking from '$lib/comps/booking/Booking.svelte';
	import { requireAuth } from '$lib/tools/guards';

	export let data: PageData;

	let isReady = false;

	onMount(async () => {
		isReady = await requireAuth(`/auth?redirect=/booking/${data.id}`);
	});
</script>

{#if isReady}
	<Booking Id={data.id} />
{:else}
	<div class="min-h-screen bg-app"></div>
{/if}
