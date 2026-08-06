<script lang="ts">
	import Footer from '$lib/comps/Footer.svelte';
	import Navbar from '$lib/comps/Navbar.svelte';
import '../app.css';
	let { children } = $props();

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 
      },
    },
  });
</script>

<svelte:head>
  <title>Movie reservation system</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
 
	<Navbar/>
  <!-- <section class="bg-black min-h-[100vh] bg-no-repeat bg-cover bg-center" style="background-image: url('/CyanLayer.svg');"> -->
   <section class="bg-black bg-cover bg-center min-h-[100vh]">
  {@render children()}
</section>
	
	
</QueryClientProvider>