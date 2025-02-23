<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { HallCreateDto, HallReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";


    export let IsOpenned: boolean = false;
    export let CinemaId: number;

    const client = useQueryClient();

    const addMovieMutation = createMutation({
      mutationFn: async() => {
        const responce:AxiosResponse<HallReadDto> = await api.halls.hallsCreate(newHall)
          return responce.data;
      },
      onSuccess: async() => {
        await client.invalidateQueries({queryKey: ['halls']});
        IsOpenned = false;
      }
    })
    
    const newHall: HallCreateDto = {
        name: "",
        cinemaId: CinemaId,
        numberOfRows: 0,
        seatsPerRow: 0
    };

    function AddNewHall(){
        $addMovieMutation.mutate();
    };

    function Close(){
        IsOpenned = false;
    }
</script>



{#if IsOpenned}
    <modal id="new_hall" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="w-full max-w-lg p-6 bg-black bg-opacity-80 border border-cyan-500 rounded-md">
            <label for="name" class="block text-cyan-400 text-sm mb-1">Name</label>
            <input bind:value={newHall.name} id="name" type="text" class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>

            <div class="flex justify-between space-x-2">
                <label for="number-of-rows" class="block text-cyan-400 text-sm mb-1">Number of rows</label>
                <label for="seat-per-row" class="block text-cyan-400 text-sm mb-1">Sears pew row </label>
            </div>

            <div class="flex justify-end space-x-2">
                <input bind:value={newHall.numberOfRows} id="password" type="number" class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
                <input bind:value={newHall.seatsPerRow} id="password" type="number" class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
            </div>

            <div class="flex justify-end space-x-3">
                <button on:click={AddNewHall} class="px-4 py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition-colors shadow-[0_0_6px_#0ff]">
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