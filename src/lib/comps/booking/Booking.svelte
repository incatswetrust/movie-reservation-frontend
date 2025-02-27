<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { type SeatReadDto, type CinemaReadDto, type HallReadDto, type ShowtimeReadDto, type MovieReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";
	import { FormatParser } from "$lib/tools/FormatParser";

    export let Id: number;

    const showtime = createQuery<ShowtimeReadDto>({
        queryKey: ['showtime'],
        queryFn: async() => {
            const responce: AxiosResponse<ShowtimeReadDto> = await api.showtimes.showtimesDetail(Id);
                return responce.data;
        }
    });

    const hall = createQuery<HallReadDto>({
        queryKey: ['hall'],
        queryFn: async()=> {
            const response: AxiosResponse<HallReadDto> = await api.halls.hallsDetail($showtime.data?.hallId!==undefined ? $showtime.data?.hallId: 0);
                return response.data;
                
        }
    });

    const cinema = createQuery<CinemaReadDto>({
        queryKey: ['cinema'],
        queryFn: async() => {
            const response: AxiosResponse<CinemaReadDto> = await api.cinemas.cinemasDetail($hall.data?.cinemaId!==undefined ? $hall.data?.cinemaId: 0);
                return response.data;
        }
    });

    const seats = createQuery<SeatReadDto[]>({
        queryKey: ['seats'],
        queryFn: async()=> {
            const response: AxiosResponse<SeatReadDto[]> = await api.seats.seatsDetail(Id);
            return response.data;
        }
    });

    const movie = createQuery<MovieReadDto>({
        queryKey: ['movie'],
        queryFn: async()=> {
            const response: AxiosResponse<MovieReadDto> = await api.movies.moviesDetail($showtime.data?.movieId!== undefined ? $showtime.data?.movieId: 0);
            return response.data;
        }
    })


    $: groupedByRow = ($seats.data || []).reduce((acc, seat) => {
        if (seat.rowLabel!==undefined && seat.rowLabel!==null && !acc[seat.rowLabel]) {
      acc[seat.rowLabel] = [];
    }
    if(seat.rowLabel!==null && seat.rowLabel!==undefined)
        acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, SeatReadDto[]>);

  // Храним выбранные места (id)
  let selectedSeatIds: number[] = [];

 
  function toggleSeat(seat: SeatReadDto) {
    if (seat.isReserved) {
      return;
    }

    if (seat.id == null) return;
    if (selectedSeatIds.includes(seat.id)) {
      selectedSeatIds = selectedSeatIds.filter(id => id !== seat.id);
    } else {
      selectedSeatIds = [...selectedSeatIds, seat.id];
    }
  }


</script>

<div class="border border-cyan-500 rounded p-4 text-cyan-300 container px-5 mx-auto overflow-y-auto">

    <h2 class="text-xl mb-4">{$movie.data?.title}</h2>
    <h3 class="text-l mb-4">{$cinema.data?.name} | {$hall.data?.name} | {FormatParser.formatDateTime($showtime.data?.startTime)}</h3>
    <h3 class="text-l mb-4">{$cinema.data?.address}</h3>

    <!--Screen-->
        <div class="py-3 flex items-center text-s text-cyan-600 uppercase before:flex-1 before:border-2 before:border-cyan-600 before:me-6 after:flex-1 after:border-2 after:border-cyan-600 after:ms-6">Screen</div>
   

        <!--Hall plan-->
        {#each Object.keys(groupedByRow) as row}
  <div class="flex items-center mb-2">
    
    <div class="mr-4 text-cyan-500 font-bold w-6 flex justify-end">
      {row}
    </div>

    
    <div class="flex-1 flex justify-between">
      {#each groupedByRow[row] as seat}
       
        <button
          class="
            border border-cyan-500
            w-8 h-8
            flex items-center justify-center
            transition-colors
          "
          class:text-cyan-300={seat.id!==undefined && !seat.isReserved && !selectedSeatIds.includes(seat.id)}
          class:cursor-pointer={!seat.isReserved}
          
          on:click={() => toggleSeat(seat)}
          
          class:bg-fuchsia-600={seat.isReserved}
          class:text-black={(seat.isReserved || (seat.id!==undefined && !seat.isReserved && selectedSeatIds.includes(seat.id)))}
          class:cursor-not-allowed={seat.isReserved}
          class:bg-cyan-600={seat.id!==undefined && !seat.isReserved && selectedSeatIds.includes(seat.id)}
          
        >
          {seat.seatNumber}
        </button>
      {/each}
    </div>
    <div class="mr-4 text-cyan-500 font-bold w-6 flex justify-end">
        {row}
      </div>
  </div>
{/each}
</div>

