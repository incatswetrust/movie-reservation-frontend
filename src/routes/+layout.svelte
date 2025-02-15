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


<QueryClientProvider client={queryClient}>
	<Navbar/>
  <section class="bg-black min-h-[100vh] bg-no-repeat bg-cover bg-center" style="background-image: url('/CyanLayer.svg');">
  {@render children()}
</section>
	
	
</QueryClientProvider>