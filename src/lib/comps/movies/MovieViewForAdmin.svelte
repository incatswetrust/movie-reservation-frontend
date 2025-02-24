<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { MovieCreateDto, MovieReadDto } from "../../../Api";
	import { api } from "../../../Module";
	import type { AxiosResponse } from "axios";

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
        description: $movie.data?.description
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