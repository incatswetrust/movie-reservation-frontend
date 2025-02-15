<script lang="ts">
  import {type CinemaReadDto} from '../../../Api';
  export let Cinema: CinemaReadDto|null;
</script>
<div class="flex items-center lg:w-3/5 mx-auto border-b border-cyan-600 pb-10 mb-10 sm:flex-row flex-col text-cyan-300">
  
  <div 
    class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full border border-cyan-500 bg-black shadow-[0_0_8px_#0ff] flex-shrink-0">
    <svg 
      fill="none" 
      stroke="currentColor" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      class="sm:w-16 sm:h-16 w-10 h-10 text-cyan-300" 
      viewBox="0 0 24 24"
    >
    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>

    
    
  </div>
  <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
    <h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
      {Cinema?.name}
    </h2>
    <p class="leading-relaxed text-base text-cyan-400">
      {Cinema?.address}
    </p>
    <a 
      class="mt-3 inline-flex items-center text-fuchsia-300 hover:text-fuchsia-100 transition-colors"
      href="#"
    >
      Learn More
      <svg 
        fill="none" 
        stroke="currentColor" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        class="w-4 h-4 ml-2" 
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </a>
  </div>
</div>
