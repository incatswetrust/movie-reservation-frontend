<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { HallReadDto, ShowtimeReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";
	import NewHall from "./NewHall.svelte";
	import { goto } from "$app/navigation";

    export let Id:number;


    const halls = createQuery<HallReadDto[]>({
      queryKey: ['halls'],
      queryFn: async () => {
        const responce: AxiosResponse<HallReadDto[]> = await api.halls.hallsByCinemaDetail(Id);
        return responce.data;
      }
    });

    const showtimes = createQuery<ShowtimeReadDto[]>({
        queryKey: ['showtimes'],
        queryFn: async() => {
          const response:AxiosResponse<ShowtimeReadDto[]> = await api.showtimes.showtimesList();
          return response.data;
        }
    });

    let checkedIds: number[] = [];
    function checkAll(e: Event){
      if(e.target instanceof HTMLInputElement) {
        if($halls.data!==undefined)
          checkedIds = e.target.checked ? [...$halls.data.map(item => item.id ?? 0)] : [];
      }
    };

    const client = useQueryClient();

    const deleteMutation = createMutation({
        mutationFn: async (id: number) =>{
            await api.halls.hallsDelete(id);
        },
        onSuccess: () =>{
            client.invalidateQueries({queryKey: ['halls']})
        }
    });

    function Delete(id:number|undefined){
      if(id!==undefined)
        $deleteMutation.mutate(id);
    };

    function DeleteAll(){
        for(let i = 0; i<checkedIds.length; i++){
            $deleteMutation.mutate(checkedIds[i]);
      }
    };

    async function Edit(id:number|undefined){
      await goto(`/cinemas/${Id}/${id}`);

    };
    let IsOpenned:boolean = false;
    function OpenNewHallModal(){
      IsOpenned = true;
    };
</script>

<table class="min-w-full text-left text-sm text-cyan-300 bg-black bg-opacity-80">
    <!-- Header -->
    <thead class="bg-black bg-opacity-90 text-cyan-100 uppercase tracking-wider">
      <tr>
        <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
          <label for="SelectAll" class="sr-only">Select All</label>
          <input type="checkbox" id="SelectAll" class="my-neon-checkbox" on:change={checkAll} checked={$halls.data!==undefined && $halls.data.length === checkedIds.length}/>
        </th>
        <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
          Id
        </th>
        <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
          Name
        </th>
        <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
          Places
        </th>
        <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
          Showtimes
        </th>
        <th class="px-4 py-2 border-b border-cyan-500">
          <button on:click={DeleteAll} aria-label="Delete checked" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
          <button aria-label="add-new" on:click={OpenNewHallModal} class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 1 1-1 0v-1h-1a.5.5 0 1 1 0-1h1v-1a.5.5 0 0 1 1 0"/>
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
              <path d="m8 3.293 4.712 4.712A4.5 4.5 0 0 0 8.758 15H3.5A1.5 1.5 0 0 1 2 13.5V9.293z"/>
            </svg>
          </button>
        </th>
      </tr>
    </thead>

    {#if $halls.isSuccess && $showtimes.isSuccess}
    <tbody class="divide-y divide-cyan-700">
        {#each $halls.data as hall}
            <tr class="hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
                <td class="px-4 py-2 font-semibold whitespace-nowrap">
                    <label for="SelectAll" class="sr-only">Select All</label>
                    <input bind:group={checkedIds} value={hall.id} type="checkbox" id="SelectAll" class="my-neon-checkbox"/>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
                    {hall.id}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
                    {hall.name}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
                    {hall.seats?.length}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
                    {$showtimes.data!==null && $showtimes.data!==undefined ? $showtimes.data.filter(item => item.hallId === hall.id).length : 0}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <button aria-label="delete" on:click={(() => Delete(hall.id))} class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
                    <button aria-label="edit" on:click={(async() => await Edit(hall.id))} class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                      </svg>
                    </button>
                  </td>
            </tr>
        {/each}
    </tbody>
    {/if}
</table>

<NewHall bind:IsOpenned={IsOpenned} CinemaId={Id}/>