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

<modal id="new_cinema" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
  <div class="w-full max-w-md rounded-md border border-accent/20 bg-surface p-6">
    <h2 class="mb-4 text-xl font-bold text-text">
      New cinema
    </h2>
    <label for="cinema-name" class="mb-1 block text-sm text-text/70">
      Name
    </label>
    <input bind:value={newCinema.name} id="cinema-name" type="text" class="mb-4 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"/>
    <label for="cinema-address" class="mb-1 block text-sm text-text/70">
      Address
    </label>
    <input bind:value={newCinema.address} id="cinema-address" type="text" class="mb-6 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"/>
    <div class="flex justify-end space-x-3">
      <button on:click={AddNewCinema} class="rounded bg-accent px-4 py-2 font-bold text-primary transition-opacity hover:opacity-90">
        Add
      </button>
      <button on:click={Close} class="rounded border border-accent/40 px-4 py-2 text-text transition-colors hover:bg-accent/10">
        Cancel
      </button>
    </div>
  </div>
</modal>
{/if}
