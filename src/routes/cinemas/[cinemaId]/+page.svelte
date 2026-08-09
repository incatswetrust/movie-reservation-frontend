<script lang="ts">
    import type { PageData } from './$types'
	import CinemaViewForAdmin from '$lib/comps/cinemas/CinemaViewForAdmin.svelte';
	import CinemaViewForRegular from '$lib/comps/cinemas/CinemaViewForRegular.svelte';
	import { auth } from '$lib/stores/auth';

    export let data: PageData;
</script>

{#if $auth.isAdmin}
    <CinemaViewForAdmin Id={data.id}/>
{:else}
    <CinemaViewForRegular Id={data.id}/>
{/if}
