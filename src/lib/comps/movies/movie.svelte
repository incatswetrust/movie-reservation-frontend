<script lang="ts">
   import {api} from '../../../Module';
   import {type MovieReadDto} from '../../../Api';

   export let Movie: MovieReadDto|null; 
</script>
<div class="xl:w-1/4 md:w-1/2 p-4">
  <div
    class="bg-black bg-opacity-50 border border-cyan-600 p-6 rounded-lg shadow-[0_0_10px_#0ff] hover:shadow-[0_0_15px_#0ff] transition-shadow duration-200"
  >
    <img 
      class="h-40 w-full object-cover object-center mb-6 rounded" 
      src="https://dummyimage.com/722x402" 
      alt="content"
    />
    <h3 class="tracking-widest text-fuchsia-400 text-xs font-medium mb-1">
      {Movie?.genre}
    </h3>
    <h2 class="text-lg text-cyan-100 font-bold mb-3 drop-shadow-[0_0_3px_#0ff]">
      {Movie?.title}
    </h2>
    <p class="leading-relaxed text-cyan-300 text-base">
      {Movie?.description}
    </p>
  </div>
</div>
