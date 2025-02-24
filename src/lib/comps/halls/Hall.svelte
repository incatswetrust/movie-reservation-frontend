<script lang="ts">
	import type { HallReadDto, ShowtimeReadDto } from "../../../Api";

    export let Hall:HallReadDto;
    export let showtimes: ShowtimeReadDto[]|null;
</script>


  

  <div class="flex items-center lg:w-3/5 mx-auto border-b border-cyan-600 pb-10 mb-10 sm:flex-row flex-col text-cyan-300">
  
    <div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full border border-cyan-500 bg-black shadow-[0_0_8px_#0ff] flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-24 h-24 text-cyan-300" viewBox="0 0 16 16">
        <path d="M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M2.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
        <path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1 2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/>
      </svg>
    </div>
    <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
      <h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
        {Hall?.name}
      </h2>
      <p class="leading-relaxed text-base text-cyan-400">
        {Hall.seats?.length} seats
      </p>
      <a href="/cinemas{Hall.cinemaId}/{Hall.id}" class="mt-3 inline-flex items-center text-fuchsia-300 hover:text-fuchsia-100 transition-colors">
        {showtimes!==null ? showtimes.length : 0} showtime{showtimes!==null && showtimes.length>1? 's' : ''}
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
    </div>
  </div>