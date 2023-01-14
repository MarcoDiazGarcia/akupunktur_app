<script lang="ts">
    import type { Disease } from "$lib/interfaces";

    export let disease: Disease;
</script>

<div class="disease-card">
    <div class="disease">
        {disease.disease}
    </div>
    <div class="points">
        {#each disease.points as point}
        <div class="point-container">
            <div class="point">
                {point.point}
            </div>
            <div class="amount-used">
                {point.amountUsed}
            </div>
            <div class="effectiveness">
                {point.effectiveness}
            </div>
        </div>
    {/each} 
    </div>
</div>

<style>
    .disease-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: rgb(30,30,30);
        border-radius: 8px;
        padding: 10px;
        box-shadow: 4px 4px 12px rgb(30,30,30, 1);
    }

    .disease {
        color: rgb(255, 255, 255, .7);
        font-size: 20px;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7);
        text-align: center; 
    }

    .points {
        background-color: rgb(47, 49, 54);
        border-radius: 4px;
        padding: 4px 10px;
    }

    .point-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 3px;
        text-align: center;
        font-size: 14px;
        color: rgb(255, 255, 255, .5);
    }

    .point-container:not(:first-child) {
        border-top: 1px solid rgb(255, 255, 255, .05);
    }
</style>