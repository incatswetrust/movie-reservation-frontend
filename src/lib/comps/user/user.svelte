<script lang="ts">
    import type {AxiosResponse} from "axios";
    import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { UserRole, type UserReadDto } from '../../../Api';
    import Admin from './admin/Admin.svelte';
    import Regular from './regular/Regular.svelte';
	import { api } from '../../../Module';


    const user = createQuery<UserReadDto>({
        queryKey: ['user'],
        queryFn: async () => {
            const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
                return response.data;
        }
    })
</script>

{#if $user.isSuccess}
    {#if $user.data!== null && $user.data!== undefined}
        {#if $user.data.role == UserRole.Value1}
            <Admin/>
        {:else if $user.data.role == UserRole.Value0}
            <Regular/>
        {/if}
    {/if}
{/if}