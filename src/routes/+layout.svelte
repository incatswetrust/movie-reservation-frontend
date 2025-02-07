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
  <section class="min-h-[90vh] max-h-[90vh] bg-no-repeat bg-cover bg-center" style="background-image: url('/Back.webp');">
  {@render children()}
</section>
	
	<Footer/>
</QueryClientProvider>