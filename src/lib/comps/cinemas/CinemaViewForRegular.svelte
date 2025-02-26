<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import Halls from "../halls/Halls.svelte";
	import type { CinemaReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";

    export let Id: number;

    const Cinema = createQuery<CinemaReadDto>({
        queryKey:['cinema'],
        queryFn: async() => {
            const responce: AxiosResponse<CinemaReadDto> = await api.cinemas.cinemasDetail(Id);
                return responce.data;
        }
    });
</script>

<!--Some info about cinema-->




<section class="bg-black bg-opacity-50">
    <div class="container px-5 mx-auto overflow-y-auto">
      <div class="flex flex-wrap w-full mb-20">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">{$Cinema.data?.name}</h1>
          <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded"></div>
          <p class="leading-relaxed text-base text-cyan-400">
            {$Cinema.data?.address}
            </p>
        </div>
        
      </div>

      <div class="flex flex-col">
        <Halls CinemaId={Id}/>
      </div>
    </div>
    
</section>



