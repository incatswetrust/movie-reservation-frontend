<script lang="ts">
	import { UserRole, type UserReadDto } from '../../Api';
  import type {AxiosResponse} from "axios";
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import {api} from '../../Module';
  const client = useQueryClient();
  const user = createQuery<UserReadDto>({
        queryKey: ['user'],
        queryFn: async () => {
            const response: AxiosResponse<UserReadDto> = await api.auth.authStatusList();
                return response.data;
        }
    });

  const logoutMutation = createMutation({
    mutationFn: async() => {
      await api.auth.authLogoutCreate();
    },
    onSuccess: () =>{
      client.invalidateQueries({queryKey: ['user']});
    }
  });

  function logout(){
    $logoutMutation.mutate();
  }  



</script>
<header class="bg-black text-cyan-300 body-font shadow-[0_0_15px_#0ff]">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
   
    <a href="/" class="flex title-font font-medium items-center text-cyan-300 mb-4 md:mb-0 hover:text-cyan-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
        <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
      </svg>
      <span class="ml-3 text-xl font-bold tracking-wide drop-shadow-[0_0_5px_cyan]">
        Movie reservation system
      </span>
    </a>

   
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-cyan-600 flex flex-wrap items-center text-base justify-center">
      <a href="/movies" class="mr-5 hover:text-cyan-100 transition-colors">Movies</a>
      
      
      {#if $user.isSuccess}
        {#if $user.data!== null && $user.data!== undefined  && $user.data.role == UserRole.Value1}
          <a href="/cinemas" class="mr-5 hover:text-cyan-100 transition-colors">Cinemas</a>
          <a href="/users" class="mr-5 hover:text-cyan-100 transition-colors">Users</a>
          <a href="/showtimes" class="mr-5 hover:text-cyan-100 transition-colors">Showtimes</a>
        {/if}
      {/if}
      <a href="/about" class="mr-5 hover:text-cyan-100 transition-colors">About</a>
    </nav>

    
    <a href="/profile" class="flex items-center text-cyan-300 hover:text-cyan-100 transition-colors">
      {#if $user.isSuccess}
        <span>{$user.data!== null && $user.data!== undefined ? $user.data.username : ""}</span>
      {/if}
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="ml-3" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
      </svg>
    </a>
    {#if $user.isSuccess && $user.data!== null && $user.data!== undefined}
    <button aria-label="log-out" on:click={logout} class="items-center text-cyan-300 hover:text-cyan-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="ml-3" viewBox="0 0 16 16">
        <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
  <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
      </svg>
    </button>
    {/if}
  </div>
</header>
