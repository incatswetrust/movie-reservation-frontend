<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { type SeatReadDto, type CinemaReadDto, type HallReadDto, type ShowtimeReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";

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


    $: groupedByRow = ($seats.data || []).reduce((acc, seat) => {
        if (seat.rowLabel!==undefined && seat.rowLabel!==null && !acc[seat.rowLabel]) {
      acc[seat.rowLabel] = [];
    }
    if(seat.rowLabel!==null && seat.rowLabel!==undefined)
        acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, SeatReadDto[]>);

  
</script>