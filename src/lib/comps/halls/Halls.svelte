<script lang="ts">
	import {createQuery } from "@tanstack/svelte-query";
	import { type HallReadDto, type ShowtimeReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";
    import Hall from "./Hall.svelte";

    export let CinemaId: number;

    const halls = createQuery<HallReadDto[]>({
        queryKey: ['halls'],
        queryFn: async ()=> {
            const response:AxiosResponse<HallReadDto[]> = await api.halls.hallsByCinemaDetail(CinemaId);
            return response.data;
        }
    });

    const showtimes = createQuery<ShowtimeReadDto[]>({
        queryKey:['showtimes'],
        queryFn: async () => {
            const responce:AxiosResponse<ShowtimeReadDto[]> = await api.showtimes.showtimesList();
            return responce.data;
        }
    });
</script>

<section class="bg-black bg-opacity-50">
    <div class="container px-5 py-24 overflow-y-auto max-h-[90vh]">
        {#if $halls.isSuccess && $showtimes.isSuccess}
            {#each $halls.data as hall}
                <Hall Hall={hall} showtimes={$showtimes.data!==null && $showtimes.data!==undefined ? $showtimes.data.filter(item=> item.hallId == hall.id):null}/>
            {/each}
        {/if}
    </div>
</section>