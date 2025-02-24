<script lang="ts">
	import Cinema from "./Cinema.svelte";
    import {type CinemaReadDto} from '../../../Api';
    import {createQuery} from "@tanstack/svelte-query";
    import type {AxiosResponse} from "axios";
    import { api } from "../../../Module";

    const cinemas = createQuery<CinemaReadDto[]>({
        queryKey: ['cinemas'],
        queryFn: async () => {
            const response: AxiosResponse<CinemaReadDto[]> = await api.cinemas.cinemasList();
            return response.data;
        }
    });
</script>
<section class="bg-black bg-opacity-50">
    <div class="container px-5 py-24 overflow-y-auto max-h-[90vh]">
        {#if $cinemas.isSuccess}
            {#each $cinemas.data as cinema}
                <Cinema Cinema = {cinema}/>
            {/each}
        {/if}
    </div>
</section>