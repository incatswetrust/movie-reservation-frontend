<script lang="ts">
  import { onMount } from 'svelte';
	import { UserRole, type UserReadDto } from '../../Api';
  import type {AxiosResponse} from "axios";
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import {api} from '../../Module';
	import { applyAction } from '$app/forms';
  const queryClient = useQueryClient();

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
    <!-- Логотип / Название -->
    <a href="/" class="flex title-font font-medium items-center text-cyan-300 mb-4 md:mb-0 hover:text-cyan-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
        <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
      </svg>
      <span class="ml-3 text-xl font-bold tracking-wide drop-shadow-[0_0_5px_cyan]">
        Movie reservation system
      </span>
    </a>

    <!-- Навигация -->
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-cyan-600 flex flex-wrap items-center text-base justify-center">
      <a href="/movies" class="mr-5 hover:text-cyan-100 transition-colors">Movies</a>
      <a href="/cinemas" class="mr-5 hover:text-cyan-100 transition-colors">Cinemas</a>
      <a href="/about" class="mr-5 hover:text-cyan-100 transition-colors">About</a>
      {#if $user.isSuccess}
        {#if $user.data!== null && $user.data!== undefined  && $user.data.role == UserRole.Value1}
        <a href="/users" class="mr-5 hover:text-cyan-100 transition-colors">Users</a>
        {/if}
      {/if}
    </nav>

    <!-- Кнопка/ссылка на профиль -->
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
    <button on:click={logout} class="items-center text-cyan-300 hover:text-cyan-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="ml-3" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
      </svg>
    </button>
    {/if}
  </div>
</header>
