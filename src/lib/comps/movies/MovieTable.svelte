<script lang="ts">
    import {createMutation, createQuery, useQueryClient} from "@tanstack/svelte-query";
    import type {AxiosResponse} from "axios";
    import { api } from "../../../Module";
	  import {type MovieReadDto } from "../../../Api";
	  import NewMovie from "./NewMovie.svelte";
	  import { goto } from "$app/navigation";
	  import MovieLabel from "./MovieLabel.svelte";


  let MovieToShow: MovieReadDto|null = null;

    const client = useQueryClient();
    const movies = createQuery<MovieReadDto[]>({
        queryKey: ['movies'],
        queryFn: async() => {
            const responce:AxiosResponse<MovieReadDto[]> = await api.movies.moviesList();
            return responce.data;
        }
    });

    const deleteMutation = createMutation({
        mutationFn: async (id: number) =>{
            await api.movies.moviesDelete(id);
        },
        onSuccess: () =>{
            client.invalidateQueries({queryKey: ['cinemas']})
        }
    });

    function Delete(id: number|undefined){
      if(id!==undefined)
        $deleteMutation.mutate(id);
    };

    async function Edit(id: number|undefined){
      if(id!==undefined)
        await goto(`/movies/${id}`);
    };

    let IsOpenned:boolean = false;
    let IsShowed:boolean = false;
    function OpenNewMovieModal(){
        IsOpenned = true;
    };

    function Show(movie: MovieReadDto){
      MovieToShow = movie;
      IsShowed = true;
    };


    let checkedIds: number[] = [];

    function checkAll(e: Event){
      if(e.target instanceof HTMLInputElement) {
        if($movies.data!==undefined)
          checkedIds = e.target.checked ? [...$movies.data.map(item => item.id ?? 0)] : [];
      }
    };

</script>

<div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">
    <table class="min-w-full text-left text-sm text-cyan-300 bg-black bg-opacity-80">
      <!-- Header -->
      <thead class="bg-black bg-opacity-90 text-cyan-100 uppercase tracking-wider">
        <tr>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input type="checkbox" id="SelectAll" class="my-neon-checkbox" on:change={checkAll} checked={$movies.data!==undefined && $movies.data.length === checkedIds.length}/>
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Id
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Title
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Genre
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Duration
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Release year
          </th>
          <th class="px-4 py-2 font-bold whitespace-nowrap border-b border-cyan-100">
            Showtimes
          </th>
          <th class="px-4 py-2 border-b border-cyan-500">
            <button aria-label="Delete checked"
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
            <button aria-label="add-new" on:click={OpenNewMovieModal}
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
          </svg>
          </button>
          </th>
        </tr>
      </thead>
  
      <!-- Body -->
       {#if $movies.isSuccess} 
        
      <tbody class="divide-y divide-cyan-700">
        {#each $movies.data as movie}
        <tr class="hover:bg-cyan-900 hover:bg-opacity-20 transition-colors">
          <td class="px-4 py-2 font-semibold whitespace-nowrap">
            <label for="SelectAll" class="sr-only">Select All</label>
            <input bind:group={checkedIds} value={movie.id} type="checkbox" id="SelectAll" class="my-neon-checkbox"/>
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {movie.id}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
           {movie.title}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {movie.genre} 
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {movie.duration}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {movie.releaseYear}
          </td>
          <td class="px-4 py-2 whitespace-nowrap text-cyan-400">
            {100} <!--change to showtimes count-->
          </td>
          <td class="px-4 py-2 whitespace-nowrap">
            <button aria-label="delete"
            on:click={(() => Delete(movie.id))}
              class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
            <button aria-label="edit" on:click={(async() => await Edit(movie.id))}
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
          </svg>
          </button>
          <button on:click={(()=>Show(movie))} aria-label="show" 
            class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/> 
          </svg>
          </button>
          </td>
        </tr>
        {/each}  
      </tbody>
      {/if}

    </table>
  </div>

  <NewMovie bind:IsOpenned={IsOpenned}/>
  <MovieLabel bind:IsOpenned={IsShowed} Movie={MovieToShow}/>