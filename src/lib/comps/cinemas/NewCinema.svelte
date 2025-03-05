<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { AxiosResponse } from "axios";
	import type { CinemaCreateDto, CinemaReadDto } from "../../../Api";
	import { api } from "../../../Module";


    const newCinema: CinemaCreateDto = {
        name: "",
        address: ""
    }
    const client = useQueryClient();
    const addCinemaMutation = createMutation({
        mutationFn: async () => {
            const responce: AxiosResponse<CinemaReadDto> = await api.cinemas.cinemasCreate(newCinema);
                return responce.data;
        },
        onSuccess: async () => {
            await client.invalidateQueries({queryKey: ['cinemas']});
            IsOpenned = false;
        }
    })

    export let IsOpenned:boolean = false;
    function Close(){
        IsOpenned = false;
    }

    
    function AddNewCinema(){
        $addCinemaMutation.mutate();
    };

</script>


{#if IsOpenned}
    

<modal id="new_cinema" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="w-full max-w-md p-6 bg-black bg-opacity-80 border border-cyan-500 rounded-md">
    <h2 class="text-cyan-300 text-xl font-bold mb-4 drop-shadow-[0_0_4px_#0ff]">
      New cinema
    </h2>
    <label for="username" class="block text-cyan-400 text-sm mb-1">
      Name
    </label>
    <input bind:value={newCinema.name} id="username" type="text" class="w-full mb-4 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
    <label for="password" class="block text-cyan-400 text-sm mb-1">
      Address
    </label>
    <input bind:value={newCinema.address} id="password" type="text" class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
    <div class="flex justify-end space-x-3">
      <button on:click={AddNewCinema} class="px-4 py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition-colors shadow-[0_0_6px_#0ff]">
        Add
      </button>
      <button on:click={Close} class="px-4 py-2 bg-transparent border border-fuchsia-600 text-fuchsia-600 rounded hover:bg-fuchsia-900 hover:bg-opacity-20 transition-colors">
        Cancel
      </button>
    </div>
  </div>
</modal>
{/if}
