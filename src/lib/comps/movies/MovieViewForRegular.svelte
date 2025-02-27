<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import type { MovieReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";
	import { FormatParser } from "$lib/tools/FormatParser";

    export let Id:number;


    const movie = createQuery<MovieReadDto>({
        queryKey: ['movie'],
        queryFn: async () => {
            const response: AxiosResponse<MovieReadDto> = await api.movies.moviesDetail(Id);
                return response.data;
        }
    });

    //get All Showtimes

    //Get All Cinemas

    //Get All Halls

    //Get all seats (free and booked)
</script>


{#if $movie.isSuccess}
    

<section class="bg-black bg-opacity-50">
    <div class="container px-5 mx-auto overflow-y-auto">
      <div class="flex flex-wrap w-full mb-20">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">{$movie.data.title}</h1>
          <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded"></div>
          <p class="leading-relaxed text-base text-cyan-400">{$movie.data.releaseYear} | {$movie.data.genre} | {FormatParser.formatMinutesToHours($movie.data.duration)}</p>
          <div class="md:w-1/2 py-5">
            <img class="object-cover object-center rounded max-h-96" alt="Movie Poster" src={$movie.data.base64Image}/>
          </div>
        </div>
        <p class="lg:w-1/2 w-full leading-relaxed text-fuchsia-200 text-opacity-90">{$movie.data.description}</p>
      </div>
      
    </div>

    
 </section>


{/if}