<script lang="ts">
	import { onMount } from "svelte";
    import type { Record } from "pocketbase";
	import { pb } from "./pocketbase";

    import { openEditTreatmentDialog } from './dialog';

    export let treatment: Record;

    let points: Record[] = [];
    onMount(async () => {
        let filter: string = 'treatment = "' + treatment.id + '"';
        points = await pb.collection('treatement_acupuncture_points').getFullList(200 , {
            filter: filter,
            expand: 'point',
            '$autoCancel': false
        });

        for (let point of points) {
            pb.collection('treatement_acupuncture_points').subscribe("*", async ({action, record}) => {
                if (treatment.id === record.treatment) {
                    if (action === "create") {
                    const point = await pb.collection('acupuncture_points').getOne(record.point);
                    record.expand = { point };
                    points = [record, ...points]; 
                }
                if (action === "update") {
                    const point = await pb.collection('acupuncture_points').getOne(record.point);
                    record.expand = { point };
                    const index = points.findIndex( p => p.id === record.id );
                    points[index] = record;
                    points = points;
                }
                if (action === "delete") {
                    points = points.filter((p) => p.id !== record.id);
                }
                }
            });
        }
    });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="treatment-card" on:click={() => openEditTreatmentDialog(treatment, points)}>
    <div class="head">
        <div class="info">
            <div class="name">
                {treatment.horse_name}
            </div>
            <div class="disease">
                {treatment.expand?.disease?.disease} | {treatment.created.substring(0, 10)}
            </div>
        </div>
        <div class="effectiveness">
            <div>
                {treatment.effectiveness}
            </div>
        </div>
    </div>
    <div class="points">
        {#each points as point}
            <div class="point">
                {point.expand?.point?.point}
            </div>
        {/each}
    </div>
    <div class="description">
        {treatment.description}
    </div>
</div>

<style>
    .treatment-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: rgb(30,30,30);
        border-radius: 8px;
        padding: 10px;
        box-shadow: 4px 4px 12px rgb(30,30,30, 1);
    }
    .head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .name {
        font-size: 18px;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7); 
    }
    .disease {
        font-size: 14px;
        font-weight: 300;
        color: rgb(255, 255, 255, 0.5);
    }
    .effectiveness {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(255, 0, 157);
        height: 38px;
        width: 38px;
        border-radius: 19px;
        color: rgb(30,30,30);
        font-size: 18px;
        font-weight: 700;
    }
    .points {
        display: flex;
        flex-flow: row wrap;
        gap: 5px;
    }
    .point {
        background-color: rgb(47, 49, 54);
        text-align: center;
        font-size: 12px;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7); 
        width: 42px;
        height: fit-content;
        padding: 2px;
        border-radius: 14px;
    }
    .description {
        background-color: rgb(54, 57, 63);
        padding: 5px;
        height: 74px;
        border-radius: 6px;
        color: rgb(255, 255, 255, 0.7);
        white-space: pre-wrap;
        overflow: scroll;
    }
</style>