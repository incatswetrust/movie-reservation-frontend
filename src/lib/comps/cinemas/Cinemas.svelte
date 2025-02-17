<script lang="ts">
	import Cinema from "./Cinema.svelte";
    import {type CinemaReadDto} from '../../../Api';
    const C: CinemaReadDto = {
        name: "Cluj Cimena",
        address: "strada Graf Dracula, 6"
    }
</script>
<section class="bg-black bg-opacity-50">
    <div class="container px-5 py-24 overflow-y-auto max-h-[90vh]">
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
        <Cinema Cinema = {C}/>
    </div>
</section>