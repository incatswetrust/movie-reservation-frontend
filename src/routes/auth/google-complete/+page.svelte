<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { api } from '../../../Module';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';

	onMount(async () => {
		const code = $page.url.searchParams.get('code');
		if (!code) {
			await goto('/auth');
			return;
		}

		try {
			const response = await api.auth.authGoogleExchangeCreate({ code });
			auth.setUser(response.data);
			await goto('/');
		} catch {
			toast.show('Google sign-in failed. Please try again.', 'error');
			await goto('/auth');
		}
	});
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<p class="text-text/60">Signing you in...</p>
</div>
