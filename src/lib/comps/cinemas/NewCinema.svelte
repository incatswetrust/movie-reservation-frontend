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

<modal id="new_cinema" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
  <div class="card-floating w-full max-w-md p-6">
    <h2 class="mb-4 text-xl font-bold text-ink">
      New cinema
    </h2>
    <label for="cinema-name" class="mb-1 block text-sm text-ink-secondary">
      Name
    </label>
    <input bind:value={newCinema.name} id="cinema-name" type="text" class="input mb-4"/>
    <label for="cinema-address" class="mb-1 block text-sm text-ink-secondary">
      Address
    </label>
    <input bind:value={newCinema.address} id="cinema-address" type="text" class="input mb-6"/>
    <div class="flex justify-end space-x-3">
      <button on:click={AddNewCinema} class="btn-primary">
        Add
      </button>
      <button on:click={Close} class="btn-secondary">
        Cancel
      </button>
    </div>
  </div>
</modal>
{/if}
