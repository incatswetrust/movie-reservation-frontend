<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAdmin } from '$lib/tools/guards';
	import UserTable from '$lib/comps/user/admin/UserTable.svelte';

	onMount(() => {
		requireAdmin();
	});
</script>

<UserTable />
