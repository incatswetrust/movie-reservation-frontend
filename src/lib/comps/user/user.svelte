<script lang="ts">
    import { onMount } from 'svelte';
    import { useQueryClient } from '@tanstack/svelte-query';
	import { UserRole, type UserReadDto } from '../../../Api';
    import Admin from './admin/Admin.svelte';
    import Regular from './regular/Regular.svelte';


    let user: UserReadDto|null|undefined = null;
    const queryClient = useQueryClient();

    onMount(() => {
        user = queryClient.getQueryData(['user']);
    });
</script>
{#if user!== null && user!== undefined}
    {#if user.role == UserRole.Value0}
        <Admin/>
    {:else if user.role == UserRole.Value1}
        <Regular/>
    {/if}
{/if}
