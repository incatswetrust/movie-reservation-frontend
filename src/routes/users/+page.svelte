<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAdminPanelAccess } from '$lib/tools/guards';
	import UserTable from '$lib/comps/user/admin/UserTable.svelte';

	onMount(() => {
		requireAdminPanelAccess();
	});
</script>

<UserTable />
