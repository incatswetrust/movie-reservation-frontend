<script lang="ts">
	import type { AxiosResponse } from "axios";
	import type { HallReadDto, SeatReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import { createQuery } from "@tanstack/svelte-query";

    export let Id: number;

    const Hall = createQuery<HallReadDto>({
        queryKey:['hall'],
        queryFn: async()=>{
            const responce: AxiosResponse<HallReadDto> = await api.halls.hallsDetail(Id);
                return responce.data;
        }
    });


    $: groupedByRow = ($Hall.data?.seats || []).reduce((acc, seat) => {
        if (seat.rowLabel!==undefined && seat.rowLabel!==null && !acc[seat.rowLabel]) {
      acc[seat.rowLabel] = [];
    }
    if(seat.rowLabel!==null && seat.rowLabel!==undefined)
        acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, SeatReadDto[]>);


</script>


{#if $Hall.isSuccess}
    <div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">
        <div class="flex justify-start space-x-2">
            <h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
                {$Hall.data.name}
            </h2>
            <button aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
            </button>
        </div>
        

        <!--Screen-->
        <div class="py-3 flex items-center text-s text-cyan-600 uppercase before:flex-1 before:border-2 before:border-cyan-600 before:me-6 after:flex-1 after:border-2 after:border-cyan-600 after:ms-6">Screen</div>
   

        <!--Hall plan-->
        {#each Object.keys(groupedByRow) as row}
            <div class="flex items-center mb-2">
                <!-- Row label -->
                <div class="mr-4 text-cyan-500 font-bold w-6 flex justify-end">
                    {row}
                </div>
        
            
                <div class="flex-1 flex justify-between">
                    {#each groupedByRow[row] as seat}
                    <!-- Square place -->
                    <div class="border border-cyan-500 text-cyan-300 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
                        {seat.seatNumber}
                    </div>
                    {/each}
                </div>
            </div>
        {/each}
    
    <!--Showtimes table-->
    </div>
{/if}

