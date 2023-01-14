<script lang="ts">
	import TreatmentCard from "./TreatmentCard.svelte";
    import type { Record } from "pocketbase";
    
    export let treatments: Record[];
</script>

<div class="treatment-card-container">
    {#each treatments as treatment (treatment.id)}
        <TreatmentCard treatment={treatment}/>
    {/each}
</div>

<style>
    .treatment-card-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
</style>