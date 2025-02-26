<script lang="ts">
	import Cinema from "./Cinema.svelte";
    import {type CinemaReadDto} from '../../../Api';
    import {createQuery} from "@tanstack/svelte-query";
    import type {AxiosResponse} from "axios";
    import { api } from "../../../Module";

    const cinemas = createQuery<CinemaReadDto[]>({
        queryKey: ['cinemas'],
        queryFn: async () => {
            const response: AxiosResponse<CinemaReadDto[]> = await api.cinemas.cinemasList();
            return response.data;
        }
    });
</script>




<section class="bg-black bg-opacity-50">
    <div class="container px-5 mx-auto overflow-y-auto">
      <div class="flex flex-wrap w-full mb-20">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">Best cinemas</h1>
          <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded"></div>
          <p class="leading-relaxed text-base text-cyan-400">
            and popcorn
            </p>
        </div>
        
      </div>

      <div class="flex flex-col">
        {#if $cinemas.isSuccess}
            {#each $cinemas.data as cinema}
                <Cinema Cinema = {cinema}/>
            {/each}
        {/if}
      </div>
    </div>
    
</section>