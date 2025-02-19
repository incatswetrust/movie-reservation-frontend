<script lang="ts">
  import {type UserRegisterDto, type UserReadDto} from '../../../Api';
      import {createMutation, useQueryClient} from "@tanstack/svelte-query";
      import type {AxiosResponse} from "axios";
      import {api} from '../../../Module';
	    import { goto } from '$app/navigation';

      const client = useQueryClient();
      let user: UserRegisterDto = {
        username: "",
        password: "",
      }
      
      const registerMutation = createMutation({
        mutationFn: async () => {
          const responce: AxiosResponse<UserReadDto> = await api.auth.authRegisterCreate(user);
            return responce.data;
        },
        onSuccess: async (userData: UserReadDto) => {
          await Success(userData);
        }
      });

      async function Register(){
        await $registerMutation.mutate();
      }
      async function Success(userData: UserReadDto){
        client.invalidateQueries({queryKey: ['user']})
        await goto('/');
      }

</script>
<section class="bg-black bg-opacity-70 text-cyan-300 body-font min-h-screen flex items-center">
  <div class="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
    <div class="lg:w-2/6 md:w-1/2 w-full bg-gray-800 bg-opacity-80 rounded-lg p-8 flex flex-col mx-auto mt-10 md:mt-0">
      <h2 class="text-cyan-200 text-2xl font-semibold mb-5 drop-shadow-[0_0_5px_#0ff]">
        Sign Up
      </h2>
      <div class="relative mb-4">
        <label for="username" class="leading-7 text-sm text-cyan-400">
          Username
        </label>
        <input bind:value={user.username}
          type="text"
          id="username"
          name="username"
          class="w-full bg-gray-700 bg-opacity-20 rounded border border-cyan-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-800 text-cyan-100 text-base outline-none py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div class="relative mb-4">
        <label for="password" class="leading-7 text-sm text-cyan-400">
          Password
        </label>
        <input bind:value={user.password}
          type="password"
          id="password"
          name="password"
          class="w-full bg-gray-700 bg-opacity-20 rounded border border-cyan-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-800 text-cyan-100 text-base outline-none py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <button on:click = {Register}
        class="text-black bg-cyan-400 border-0 py-2 px-8 focus:outline-none hover:bg-cyan-300 rounded text-lg transition-colors duration-200 ease-in-out font-bold"
      >
        Sign Up
      </button>
      <a href="/auth/login" class="text-xs mt-3 hover:text-cyan-100 transition-colors">
        Already have an account?
      </a>
    </div>
  </div>
</section>
