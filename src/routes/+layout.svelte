<script lang="ts">
	import Footer from '$lib/comps/Footer.svelte';
	import Navbar from '$lib/comps/Navbar.svelte';
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { auth } from '$lib/stores/auth';
	let { children } = $props();

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				//
			}
		}
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', $theme === 'dark');
	});

	$effect(() => {
		auth.loadStatus();
	});
</script>

<svelte:head>
	<title>Movie reservation system</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-primary text-text">
	<QueryClientProvider client={queryClient}>
		<Navbar />
		<section class="flex-1 bg-primary bg-cover bg-center">
			{@render children()}
		</section>
		<Footer />
	</QueryClientProvider>
</div>
