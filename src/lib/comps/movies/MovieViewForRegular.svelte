<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import type { MovieReadDto, ShowtimeReadDto } from "../../../Api";
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
    const showtimes = createQuery<ShowtimeReadDto[]>({
        queryKey:['showtimes'],
        queryFn: async () => {
            const responce:AxiosResponse<ShowtimeReadDto[]> = await api.showtimes.showtimesMovieDetail(Id);
            return responce.data;
        }
    });

    //Get all seats (free and booked)

    function bookShowtime(id:number|undefined){

    }

    let sortColumn: 'cinema' | 'time' | 'price' = 'time';
    let sortDirection: 'asc' | 'desc' = 'asc';

    $: sortedShowtimes = [...($showtimes.data ?? [])].sort((a, b) => {
    let valA, valB;
    switch (sortColumn) {
      case 'cinema':
        valA = a.cinemaName;
        valB = b.cinemaName;
        break;
      case 'time':
        valA = a.startTime!==undefined? new Date(a.startTime).getTime() : new Date();
        valB = b.startTime!==undefined? new Date(b.startTime).getTime() : new Date();
        break;
      case 'price':
        valA = a.price;
        valB = b.price;
        break;
    }
    if(valA!== null && valB!==null && valA!== undefined && valB!==undefined){
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
    

    function sortBy(column: 'cinema' | 'time' | 'price') {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }
</script>


{#if $movie.isSuccess}
<section class="bg-black bg-opacity-50">
  <div class="container mx-auto px-5">

    
    <div class="flex flex-col lg:flex-row gap-6">

      
      <div class="lg:w-1/3 w-full">
        <h1 class="text-3xl font-medium mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">
          {$movie.data.title}
        </h1>
        <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded mb-2"></div>
        <p class="leading-relaxed text-base text-cyan-400 mb-4">
          {$movie.data.releaseYear} | {$movie.data.genre} | {FormatParser.formatMinutesToHours($movie.data.duration)}
        </p>
        <img
          class="object-cover object-center rounded max-h-96"
          alt="Movie Poster"
          src={$movie.data.base64Image}
        />
      </div>

     
      <div class="lg:w-2/3 w-full">
        
       
        <p class="leading-relaxed text-fuchsia-200 text-opacity-90 mb-6">
          {$movie.data.description}
        </p>

       
        <div class="border border-cyan-500 rounded p-4 text-cyan-300">
          <h2 class="text-xl mb-4">Showtimes</h2>
          
          
          <div class="flex items-center gap-2 mb-4">
            <span class="text-cyan-400">Sort by:</span>
            
            
            <button class="px-3 py-1 bg-transparent border border-cyan-600 text-cyan-300 rounded hover:bg-cyan-900 hover:bg-opacity-20 transition-colors" on:click={() => sortBy('cinema')}>
              Cinema
            </button>
            <button class="px-3 py-1 bg-transparent border border-cyan-600 text-cyan-300 rounded hover:bg-cyan-900 hover:bg-opacity-20 transition-colors" on:click={() => sortBy('time')}>
              Time
            </button>
            <button class="px-3 py-1 bg-transparent border border-cyan-600 text-cyan-300 rounded hover:bg-cyan-900 hover:bg-opacity-20 transition-colors" on:click={() => sortBy('price')}>
              Price
            </button>
          </div>
          
          
           {#if $showtimes.isSuccess}
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm text-cyan-300 bg-black bg-opacity-80">
             
              <thead class="bg-black bg-opacity-90 text-cyan-100 uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-2 border-b border-cyan-500">Cinema</th>
                  <th class="px-4 py-2 border-b border-cyan-500">Hall</th>
                  <th class="px-4 py-2 border-b border-cyan-500">Time</th>
                  <th class="px-4 py-2 border-b border-cyan-500">Price</th>
                  <th class="px-4 py-2 border-b border-cyan-500"></th>
                </tr>
              </thead>
              
              <tbody class="divide-y divide-cyan-700">
                {#each sortedShowtimes as st}
                  <tr class="hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
                    <td class="px-4 py-2">
                      {st.cinemaName}
                    </td>
                    <td class="px-4 py-2">
                      {st.hallName}
                    </td>
                    <td class="px-4 py-2">
                      {FormatParser.formatDateTime(st.startTime)} 
                    </td>
                    <td class="px-4 py-2">
                      ${st.price}
                    </td>
                    <td class="px-4 py-2">
                      <button class="px-3 py-1 bg-transparent border border-fuchsia-600 text-fuchsia-600 rounded hover:bg-fuchsia-900 hover:bg-opacity-20 transition-colors" on:click={() => bookShowtime(st.id)} >
                        Book
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
        </div> 
      
      </div>
    </div>

  </div>
</section>
{/if}


