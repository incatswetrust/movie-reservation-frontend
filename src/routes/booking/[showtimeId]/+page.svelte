<script lang="ts">
    import type { PageData } from './$types'
	import CinemaViewForAdmin from '$lib/comps/cinemas/CinemaViewForAdmin.svelte';
	import HallViewForAdmin from '$lib/comps/halls/HallViewForAdmin.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import ShowtimesByHall from '$lib/comps/showtimes/ShowtimesByHall.svelte';
	import { api } from '../../../Module';
	import type { UserReadDto } from '../../../Api';
	import { goto } from '$app/navigation';
    export let data: PageData;

    
    const user = createQuery<UserReadDto|null>({
        queryKey: ['user'],
        queryFn: async () => {
            try{
            const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
                return response.data;
            }
            catch(err: any) {
                if (err.response?.status === 401) {
                    await goto(`/auth/login?redirect=${window.location.pathname}`);
                    return null;
                }
                    throw err;
            }
        }
    });
</script>

