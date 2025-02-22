<script lang="ts">
	import { createMutation, createQuery } from "@tanstack/svelte-query";
	import HallsTable from '../halls/HallsTable.svelte';
	import { type CinemaReadDto } from '../../../Api';
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";
    export let Id: number;

    //getCinemaById
    const Cinema = createQuery<CinemaReadDto>({
        queryKey:['cinema'],
        queryFn: async() => {
            const responce: AxiosResponse<CinemaReadDto> = await api.cinemas.cinemasDetail(Id);
                return responce.data;
        }
    });


</script>

{#if $Cinema.isSuccess}
    
<div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">

    <div class="flex justify-start space-x-2">
<h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
    {$Cinema.data.name}
  </h2>
  <button aria-label="edit" 
    class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
  </svg>
  </button>
</div>

<div class="flex justify-start space-x-2">
  <p class="leading-relaxed text-base text-cyan-400">
    {$Cinema.data.address}
  </p>
  <button aria-label="edit"
    class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
  </svg>
  </button>
</div>

  <HallsTable Id={Id}/>
</div>

  {/if}

