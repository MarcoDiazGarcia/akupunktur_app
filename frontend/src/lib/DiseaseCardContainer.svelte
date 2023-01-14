<script lang="ts">
    import type { Disease } from "$lib/interfaces";
	import DiseaseCard from "$lib/DiseaseCard.svelte";

    export let diseases: Disease[] = [];
</script>

<div class="disease-card-container">
    {#each diseases as disease (disease.id)}
        <DiseaseCard disease={disease}/>
    {/each}
</div>

<style>
    .disease-card-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>