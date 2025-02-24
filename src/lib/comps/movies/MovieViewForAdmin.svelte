<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { MovieCreateDto, MovieReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";
	import ShowTimeByMovieTable from "../showtimes/ShowTimeByMovieTable.svelte";

    export let Id: number;

    const client = useQueryClient();
    const movie = createQuery<MovieReadDto>({
        queryKey:['movie'],
        queryFn: async()=> {
            const response: AxiosResponse<MovieReadDto> = await api.movies.moviesDetail(Id);
                return response.data;
        }
    });
    let editMovieNameMode: boolean = false;
    let editMovieGenreMode: boolean = false;
    let editMovieDurationMode: boolean = false;
    let editMovieReleaseMode: boolean = false;
    let editMovieDescriptionMode: boolean = false;

    let movieUpdate: MovieCreateDto ={
        title: $movie.data?.title,
        genre: $movie.data?.genre,
        duration: $movie.data?.duration,
        releaseYear: $movie.data?.releaseYear,
        description: $movie.data?.description,
        base64Image: $movie.data?.base64Image
    };

    const updateMutation = createMutation({
        mutationFn: async()=> {
            const response:AxiosResponse<MovieReadDto> = await api.movies.moviesUpdate(Id, movieUpdate);
                return response.data;
        },
        onSuccess: ()=>{
            client.invalidateQueries({queryKey: ['movie']});
            editMovieNameMode = false;
            editMovieGenreMode = false;
            editMovieDurationMode = false;
            editMovieReleaseMode = false;
            editMovieDescriptionMode = false;
        }
    });

    function Edit(){
      $updateMutation.mutate();
    };
</script>

{#if $movie.isSuccess}
    <div class="py-5 lg:w-3/4 mx-auto overflow-x-auto">
        
            
        <div class="flex justify-start space-x-2">
            {#if !editMovieNameMode}
                <h2 class="text-cyan-100 text-xl title-font font-bold mb-2 drop-shadow-[0_0_3px_#0ff]">
                    {$movie.data.title}
                </h2>
                <button on:click={(()=> {editMovieNameMode=true})} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            {:else}
                <input bind:value={movieUpdate.title} id="name" type="text" class="w-1/4 mb-4 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
                <button on:click={Edit} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg>
                </button>
                <button on:click={(()=> {editMovieNameMode=false})} aria-label="cancel" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            {/if}
        </div>

        <div class="flex justify-start space-x-2">
            {#if !editMovieGenreMode}
                <p class="leading-relaxed text-base text-cyan-400">
                    {$movie.data.genre}
                </p>
                <button on:click={(()=> {editMovieGenreMode=true})} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            {:else}
                <input bind:value={movieUpdate.genre} id="name" type="text" class="w-1/4 mb-4 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
                <button on:click={Edit} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg>
                </button>
                <button on:click={(()=> {editMovieGenreMode=false})} aria-label="cancel" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            {/if}
        </div>

        <div class="flex justify-start space-x-2">
            {#if !editMovieDurationMode}
                <p class="leading-relaxed text-base text-cyan-400">
                    {$movie.data.duration}
                </p>
                <button on:click={(()=> {editMovieDurationMode=true})} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            {:else}
                <input bind:value={movieUpdate.duration} id="name" type="text" class="w-1/4 mb-4 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
                <button on:click={Edit} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg>
                </button>
                <button on:click={(()=> {editMovieDurationMode=false})} aria-label="cancel" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            {/if}
        </div>

        <div class="flex justify-start space-x-2">
            {#if !editMovieReleaseMode}
                <p class="leading-relaxed text-base text-cyan-400">
                    {$movie.data.releaseYear}
                </p>
                <button on:click={(()=> {editMovieReleaseMode=true})} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            {:else}
                <input bind:value={movieUpdate.releaseYear} id="name" type="number" class="w-1/4 mb-4 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"/>
                <button on:click={Edit} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg>
                </button>
                <button on:click={(()=> {editMovieReleaseMode=false})} aria-label="cancel" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            {/if}
        </div>

        <div class="flex justify-start space-x-2">
            {#if !editMovieDescriptionMode}
                <p class="leading-relaxed text-base text-cyan-400">
                    {$movie.data.description}
                </p>
                <button on:click={(()=> {editMovieDescriptionMode=true})} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            {:else}
                <textarea bind:value={movieUpdate.description} class="w-full mb-6 px-3 py-2 bg-transparent border border-cyan-600 rounded text-cyan-100 focus:outline-none focus:border-cyan-400 placeholder-cyan-500 transition-colors"></textarea>
                <button on:click={Edit} aria-label="edit" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg>
                </button>
                <button on:click={(()=> {editMovieDescriptionMode=false})} aria-label="cancel" class="inline-block rounded-sm bg-transperent px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            {/if}
        </div>
        <ShowTimeByMovieTable MovieId={Id}/>
    </div>
{/if}

