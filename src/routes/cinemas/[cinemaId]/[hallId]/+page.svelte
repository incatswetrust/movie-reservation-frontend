<script lang="ts">
    import type { PageData } from './$types'
	import CinemaViewForAdmin from '$lib/comps/cinemas/CinemaViewForAdmin.svelte';
	import HallViewForAdmin from '$lib/comps/halls/HallViewForAdmin.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { UserRole, type UserReadDto } from '../../../../Api';
	import type { AxiosResponse } from 'axios';
	import { api } from '../../../../Module';
	import ShowtimesByHall from '$lib/comps/showtimes/ShowtimesByHall.svelte';
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
    <HallViewForAdmin Id={data.id}/>
{:else}
    <ShowtimesByHall Id={data.id}/>
{/if}