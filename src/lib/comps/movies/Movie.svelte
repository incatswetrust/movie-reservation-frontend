<script lang="ts">
   import {api} from '../../../Module';
   import {type MovieReadDto} from '../../../Api';
	import { FormatParser } from '$lib/tools/FormatParser';

   export let Movie: MovieReadDto|null; 

   
</script>
<div class="xl:w-1/4 md:w-1/2 p-4">
  <div
    class="bg-black bg-opacity-50 border border-cyan-600 p-6 rounded-lg shadow-[0_0_10px_#0ff] hover:shadow-[0_0_15px_#0ff] transition-shadow duration-200"
  >
    <img 
      class="h-40 w-full object-cover object-center mb-6 rounded" 
      src={Movie?.base64Image} 
      alt="content"
    />
    <h3 class="tracking-widest text-fuchsia-400 text-xs font-medium mb-1">
      {Movie?.releaseYear} | {Movie?.genre} | {FormatParser.formatMinutesToHours(Movie?.duration)}
    </h3>
    <div class="relative group w-64">
      <h2 class="text-lg text-cyan-100 font-bold mb-3 drop-shadow-[0_0_3px_#0ff]">
        {FormatParser.shortNameFormat(Movie?.title)}
      </h2>
      {#if Movie?.title?.length!==undefined && Movie?.title?.length>=20}
        <div class="absolute hidden group-hover:block bg-gray-800 bg-opacity-90 text-cyan-200 text-sm px-3 py-2 rounded w-max max-w-xs -top-0 left-0 z-50">
          {Movie?.title}
        </div>
      {/if}
    </div>
    <a href={`/movies/${Movie?.id}`} class="mt-3 inline-flex items-center text-fuchsia-300 hover:text-fuchsia-100 transition-colors">
      Book now
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </a>
  </div>
</div>
