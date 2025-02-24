<script lang="ts">
	import type { HallReadDto } from "../../../Api";

    export let Hall:HallReadDto;
    export let showtimes: number;
</script>

<section class="bg-black text-cyan-300 body-font">
    <div class="container px-5 py-24 mx-auto flex flex-wrap">
      
      <h2 class="sm:text-3xl text-2xl font-bold mb-2 md:w-2/5 text-cyan-100 drop-shadow-[0_0_4px_#0ff]">
        {Hall.name}
      </h2>
      
      
      <div class="md:w-3/5 md:pl-6">
        <p class="leading-relaxed text-base mb-4">
        {Hall.seats?.length} seats
        </p>
        
        <div class="flex md:mt-4 mt-6">
          <a class="text-cyan-400 inline-flex items-center ml-4 hover:text-cyan-100 transition-colors"href="/cinemas{Hall.cinemaId}/{Hall.id}">
            {showtimes} showtime{showtimes>1? 's' : ''}
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
  