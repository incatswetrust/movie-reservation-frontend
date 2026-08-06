<script lang="ts">
	import Footer from '$lib/comps/Footer.svelte';
	import Navbar from '$lib/comps/Navbar.svelte';
	import '../app.css';
	import { theme } from '$lib/stores/theme';
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
</script>

<svelte:head>
	<title>Movie reservation system</title>
</svelte:head>

<div class="min-h-screen bg-primary text-text">
	<QueryClientProvider client={queryClient}>
		<Navbar />
		<!-- <section class="bg-black min-h-[100vh] bg-no-repeat bg-cover bg-center" style="background-image: url('/CyanLayer.svg');"> -->
		<section class="min-h-[100vh] bg-black bg-cover bg-center">
			{@render children()}
		</section>
	</QueryClientProvider>
</div>
