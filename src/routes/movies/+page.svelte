<script lang="ts">
	import Movies from "$lib/comps/movies/Movies.svelte";
	import {createMutation, createQuery, useQueryClient} from "@tanstack/svelte-query";
    import  type {AxiosResponse} from "axios";
	import { UserRole, type UserReadDto } from "../../Api";
    import { api } from "../../Module";
	import MovieTable from "$lib/comps/movies/MovieTable.svelte";

	const user = createQuery<UserReadDto>({
        queryKey: ['user'],
        queryFn: async () => {
            const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
                return response.data;
        }
    });

</script>
{#if $user.isSuccess && $user.data!==undefined && $user.data!==null && $user.data.role === UserRole.Value1}
	<MovieTable/>
{:else}
	<Movies/>
{/if}