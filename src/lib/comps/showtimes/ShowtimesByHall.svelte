<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import type { HallReadDto, MovieReadDto, ShowtimeReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";
	import ShowtimeByHall from "./ShowtimeByHall.svelte";

    export let Id: number;

    const Hall = createQuery<HallReadDto>({
            queryKey:['hall'],
            queryFn: async()=>{
                const responce: AxiosResponse<HallReadDto> = await api.halls.hallsDetail(Id);
                    return responce.data;
            }
        });

        const showtimes = createQuery<ShowtimeReadDto[]>({
        queryKey:['showtimes'],
        queryFn: async () => {
            const responce:AxiosResponse<ShowtimeReadDto[]> = await api.showtimes.showtimesHallDetail(Id);
            return responce.data;
        }
    });

    const movies = createQuery<MovieReadDto[]>({
    queryKey: ['movies'],
    queryFn: async () => {
      const response: AxiosResponse<MovieReadDto[]> = await api.movies.moviesList();
      return response.data;
    }
  });

</script>


<section class="bg-black bg-opacity-50">
    <div class="container px-5 mx-auto overflow-y-auto max-h-[90vh]">
      <div class="flex flex-wrap w-full mb-20">
        <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">{$Hall.data?.name}</h1>
          <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded"></div>
        </div>
      </div>
      <div class="flex flex-wrap -m-4">
        {#if $showtimes.isSuccess}
            {#each $showtimes.data as showtime}
                <ShowtimeByHall Movie={$movies.data?.find(item => item.id === showtime.movieId)} Showtime={showtime}/>
            {/each}
        {/if}
      </div>
    </div>
  </section>
