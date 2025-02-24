<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import Halls from "../halls/Halls.svelte";
	import type { CinemaReadDto } from "../../../Api";
	import type { AxiosResponse } from "axios";
	import { api } from "../../../Module";

    export let Id: number;

    const Cinema = createQuery<CinemaReadDto>({
        queryKey:['cinema'],
        queryFn: async() => {
            const responce: AxiosResponse<CinemaReadDto> = await api.cinemas.cinemasDetail(Id);
                return responce.data;
        }
    });
</script>

<!--Some info about cinema-->
<div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">
    
        <h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
            {$Cinema.data?.name}
        </h2>

        <p class="leading-relaxed text-base text-cyan-400">
            {$Cinema.data?.address}
        </p>
</div>
<Halls CinemaId={Id}/>