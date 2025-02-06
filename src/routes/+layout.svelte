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
	{@render children()}
	<Footer/>
</QueryClientProvider>