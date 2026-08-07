<script lang="ts">
	import { type MovieReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import Movie from "./Movie.svelte";
  import {createQuery} from "@tanstack/svelte-query";
  import type {AxiosResponse} from "axios";

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
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-fuchsia-200 drop-shadow-[0_0_3px_#FF00FF]">Show time</h1>
          <div class="h-1 w-20 bg-cyan-200 drop-shadow-[0_0_3px_#0ff] rounded"></div>
        </div>
        <p class="lg:w-1/2 w-full leading-relaxed text-fuchsia-200 text-opacity-90">"I love acting. Oh, God, I love it. But all this fame and all this bullshit attention. I'm not supernatural. I've done nothing extremely special to deserve the position. It happens every couple of years, and it's happened to hundreds of people before me."</p>
      </div>
      <div class="flex flex-wrap -m-4">
        {#if $movies.isSuccess}
          {#each $movies.data as movie}
            <Movie Movie = {movie}/>
          {/each}
        {/if}
      </div>
    </div>
  </section>

