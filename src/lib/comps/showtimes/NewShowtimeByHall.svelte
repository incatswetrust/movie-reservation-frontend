<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { MovieReadDto, ShowtimeCreateDto, ShowtimeReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";

    export let IsOpenned:boolean = false;
    export let HallId:number;

    let newShowtime: ShowtimeCreateDto ={
        hallId: HallId,
        movieId: 0,
        startTime: "",
        price: 0
    };

    const client = useQueryClient();
    const addShowTimeMutation = createMutation({
        mutationFn: async () => {
            const responce: AxiosResponse<ShowtimeReadDto> = await api.showtimes.showtimesCreate(newShowtime);
                return responce.data;
        },
        onSuccess: async () => {
            await client.invalidateQueries({queryKey: ['showtimes']});
            IsOpenned = false;
        }
    });

    let now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    let date = `${year}-${month}-${day}T${hour}:${min}`;

    function AddNewShowTime(){
        const datetime = new Date(date);
        newShowtime.startTime = datetime.toISOString();
        $addShowTimeMutation.mutate();
    };

    function Close(){
        IsOpenned = false;
    };

    //getAllMovies
    const movies = createQuery<MovieReadDto[]>({
    queryKey: ['movies'],
    queryFn: async () => {
      const response: AxiosResponse<MovieReadDto[]> = await api.movies.moviesList();
      return response.data;
    }
  });
</script>

{#if IsOpenned}
    <modal id="new_hall" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="w-full max-w-lg p-6 bg-black bg-opacity-80 border border-cyan-500 rounded-md">
            <form class="max-w-sm mx-auto">
                <label for="movies" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select movie</label>
                <select bind:value={newShowtime.movieId} id="movies" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option selected>Choose a movie</option>
                  {#if $movies.isSuccess}
                    {#each $movies.data as movie}
                        <option value={movie.id}>{movie.title}</option>
                    {/each}
                  {/if}
                </select>
              </form>

            <div class="flex justify-between space-x-2">
                <label for="number-of-rows" class="block text-cyan-400 text-sm mb-1">Start time</label>
                <label for="seat-per-row" class="block text-cyan-400 text-sm mb-1">Price</label>
            </div>

            <div class="flex justify-end space-x-2">
                <div class="flex flex-col mb-4 w-72">
                    <input bind:value={date}
                      type="datetime-local"
                      id="startDateTime"
                      name="startDateTime"
                  
                      class="
                        px-3 py-2
                        bg-transparent
                        border border-cyan-500
                        text-cyan-300
                        placeholder-cyan-500
                        rounded
                        focus:outline-none
                        focus:border-cyan-400
                        hover:shadow-[0_0_6px_#0ff]
                        transition-colors
                      "
                  
                      
                      min="2025-01-01T00:00"
                      max="2026-12-31T23:59"
                    />
                  </div>
                <input bind:value={newShowtime.price} id="password" type="number" class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
            </div>

            <div class="flex justify-end space-x-3">
                <button on:click={AddNewShowTime} class="px-4 py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition-colors shadow-[0_0_6px_#0ff]">
                Add
                </button>
                <button on:click={Close}
                class="px-4 py-2 bg-transparent border border-fuchsia-600 text-fuchsia-600 rounded hover:bg-fuchsia-900 hover:bg-opacity-20 transition-colors">
                Cancel
                </button>
            </div>
        </div>
    </modal>
{/if}