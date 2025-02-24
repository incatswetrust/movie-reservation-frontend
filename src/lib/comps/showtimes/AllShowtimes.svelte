<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { ShowtimeReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";
	import { FormatParser } from "$lib/tools/FormatParser";


    const showtimes = createQuery<ShowtimeReadDto[]>({
        queryKey:['showtimes'],
        queryFn: async () => {
            const responce:AxiosResponse<ShowtimeReadDto[]> = await api.showtimes.showtimesList();
            return responce.data;
        }
    });

    const client = useQueryClient();

    const deleteMutation = createMutation({
        mutationFn: async (id: number) =>{
            await api.showtimes.showtimesDelete(id);
        },
        onSuccess: () =>{
            client.invalidateQueries({queryKey: ['showtimes']})
        }
    });

    function DeleteAll(){
        for(let i = 0; i<checkedIds.length; i++){
            $deleteMutation.mutate(checkedIds[i]);
      }
    };

    

    let checkedIds: number[] = [];
    function checkAll(e: Event){
        if(e.target instanceof HTMLInputElement) {
        if($showtimes.data!==undefined)
          checkedIds = e.target.checked ? [...$showtimes.data.map(item => item.id ?? 0)] : [];
      }
    };

    function Delete(id: number|undefined){
      if(id!==undefined)
        $deleteMutation.mutate(id);
    };

    async function Edit(id: number|undefined){
      
    };

    let IsOpenned: boolean = false;
    function OpenNewShowtimeModal(){
        IsOpenned = true;
    };

</script>

<table class="min-w-full text-left text-sm text-cyan-300 bg-black bg-opacity-80">

    <thead class="bg-black bg-opacity-90 text-cyan-100 uppercase tracking-wider">
        <tr>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input type="checkbox" id="SelectAll" class="my-neon-checkbox" on:change={checkAll} checked={$showtimes.data!==undefined && $showtimes.data.length === checkedIds.length}/>
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Id
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Movie title
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Cimena
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Hall
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Start time
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Price
          </th>
          <th class="px-4 py-2 border-b border-cyan-500">
            <button aria-label="Delete checked" on:click={DeleteAll}
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
            <button aria-label="add-new" on:click={OpenNewShowtimeModal}
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
          </svg>
          </button>
          </th>
        </tr>
      </thead>

      {#if $showtimes.isSuccess} 
      <tbody class="divide-y divide-cyan-700">
        {#each $showtimes.data as showtime}
        <tr class="hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
          <td class="px-4 py-2 font-semibold whitespace-nowrap">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input bind:group={checkedIds} value={showtime.id} type="checkbox" id="SelectAll" class="my-neon-checkbox"/>
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {showtime.id}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
           {FormatParser.shortNameFormat(showtime.movieName)}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {FormatParser.shortNameFormat(showtime.cinemaName)} 
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {FormatParser.shortNameFormat(showtime.hallName)}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {FormatParser.formatDateTime(showtime.startTime)}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {showtime.price}
          </td>
          <td class="px-4 py-2 whitespace-nowrap">
            <button aria-label="delete"
            on:click={(() => Delete(showtime.id))}
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
            <button aria-label="edit" on:click={(async() => await Edit(showtime.id))}
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
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