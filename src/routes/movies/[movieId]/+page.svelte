<script lang="ts">
    import type { PageData } from './$types'
	import MovieViewForAdmin from '$lib/comps/movies/MovieViewForAdmin.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import { UserRole, type UserReadDto } from '../../../Api';
	import { api } from '../../../Module';
	import MovieViewForRegular from '$lib/comps/movies/MovieViewForRegular.svelte';
    export let data: PageData;


const user = createQuery<UserReadDto>({
    queryKey: ['user'],
    queryFn: async () => {
        const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
            return response.data;
    }
});
</script>
{#if $user.isSuccess && $user.data!==undefined && $user.data!==null && $user.data.role === UserRole.Value1}
    <MovieViewForAdmin Id={data.id}/>
{:else}
    <MovieViewForRegular Id={data.id}/>
{/if}