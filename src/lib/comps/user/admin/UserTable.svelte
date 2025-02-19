<script lang="ts">
    import {createMutation, createQuery, useQueryClient} from "@tanstack/svelte-query";
    import type {AxiosResponse} from "axios";
    import { api } from "../../../../Module";
	import {type UserReadDto } from "../../../../Api";
	import { applyAction } from "$app/forms";


    const client = useQueryClient();

    const users = createQuery<UserReadDto[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response: AxiosResponse<UserReadDto[]> = await api.users.usersList();
                return response.data;
        }
    });

    const deleteMutation = createMutation({
        mutationFn: async (id: number) =>{
            await api.users.usersDelete(id);
        },
        onSuccess: () =>{
            client.invalidateQueries({queryKey: ['users']})
        }
    })

    function Delete(id: number|undefined){
        if(id!==undefined)
            $deleteMutation.mutate(id);
    }

</script>

<div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">
    <table class="min-w-full text-left text-sm text-cyan-300 bg-black bg-opacity-80">
      <!-- Header -->
      <thead class="bg-black bg-opacity-90 text-cyan-100 uppercase tracking-wider">
        <tr>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input type="checkbox" id="SelectAll" class="my-neon-checkbox" />
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Id
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Username
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Bookings
          </th>
          <th class="px-4 py-2 border-b border-cyan-500">
            <button
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
        <button
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
          </svg>
          </button>
          </th>
        </tr>
      </thead>
  
      <!-- Body -->
       {#if $users.isSuccess} 
        
      <tbody class="divide-y divide-cyan-700">
        {#each $users.data as user}
        <tr class="hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
          <td class="px-4 py-2 font-semibold whitespace-nowrap">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input type="checkbox" id="SelectAll" class="my-neon-checkbox"/>
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {user.id}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
           {user.username}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {user.role} <!--Change to user bookings-->
          </td>
          <td class="px-4 py-2 whitespace-nowrap">
            <button
            on:click={(() => Delete(user.id))}
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </td>
        </tr>
        {/each}  
      </tbody>
      {/if}

    </table>
  </div>

  