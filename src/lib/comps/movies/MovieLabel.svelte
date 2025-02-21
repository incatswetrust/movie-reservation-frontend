<script lang="ts">
    import {type MovieReadDto} from '../../../Api';
    export let Movie: MovieReadDto|null; 
    export let IsOpenned: boolean = false;

    function Close(){
        IsOpenned = false;
    };
    function formatMinutesToHours(minutes: number|undefined): string {
        if(minutes === undefined){
            return "";
        }
        if (minutes < 60) {
            return `${minutes}m`;
        } else {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h}h ${m}m`;
        }
   };
</script>

{#if IsOpenned}
<modal 
  id="new_movie"
  class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
>
 
  <div 
    class="
      max-w-4xl 
      w-full 
      bg-black 
      bg-opacity-80 
      border 
      border-cyan-600 
      shadow-[0_0_15px_#0ff] 
      p-6 
      rounded 
      flex 
      flex-col 
      md:flex-row 
      items-center 
      gap-6 
      mx-4
    "
  >
    
    <div class="md:w-1/2 flex justify-center">
      <img 
        class="
          object-cover 
          object-center 
          rounded
          max-h-96 
        "
        alt="Movie Poster"
        src={Movie?.base64Image}
      />
    </div>


    <div 
      class="
        md:w-1/2 
        flex 
        flex-col 
        md:items-start 
        md:text-left 
        items-center 
        text-center
      "
    >
      <h1 
        class="
          text-cyan-100 
          text-3xl 
          sm:text-4xl 
          font-bold 
          mb-4 
          drop-shadow-[0_0_3px_#0ff]
        "
      >
        {Movie?.title}
      </h1>

      <h2 
        class="
          text-cyan-200 
          text-xl 
          sm:text-2xl 
          font-semibold 
          mb-2 
          drop-shadow-[0_0_2px_#0ff]
        "
      >
        Genre: {Movie?.genre}
      </h2>

      <h3 
        class="
          text-cyan-200 
          text-xl 
          sm:text-2xl 
          font-semibold 
          mb-2 
          drop-shadow-[0_0_2px_#0ff]
        "
      >
        Duration: {formatMinutesToHours(Movie?.duration)}
      </h3>

      <p 
        class="
          text-cyan-300 
          text-base 
          leading-relaxed 
          mb-6
        "
      >
        {Movie?.description}
      </p>

      <div class="flex justify-center md:justify-start w-full">
        <button 
          on:click={Close} 
          class="
            inline-flex 
            items-center 
            bg-cyan-600 
            hover:bg-cyan-500 
            text-black 
            font-bold 
            py-2 
            px-6 
            rounded
            transition-colors 
            duration-200
          "
        >
          Close
        </button>
      </div>
    </div>
  </div>
</modal>

{/if}