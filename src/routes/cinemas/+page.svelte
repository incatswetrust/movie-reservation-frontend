<script lang="ts">
	import Cinemas from "$lib/comps/cinemas/Cinemas.svelte";
	import {createMutation, createQuery, useQueryClient} from "@tanstack/svelte-query";
    import  type {AxiosResponse} from "axios";
	import { UserRole, type UserReadDto } from "../../Api";
    import { api } from "../../Module";
	import CinemaTable from "$lib/comps/cinemas/CinemaTable.svelte";

	const user = createQuery<UserReadDto>({
        queryKey: ['user'],
        queryFn: async () => {
            const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
                return response.data;
        }
    });
</script>

{#if $user.isSuccess && $user.data!==undefined && $user.data!==null && $user.data.role === UserRole.Value1}
	<CinemaTable/>
{/if}