<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import TreatmentCardContainer from "$lib/TreatmentCardContainer.svelte";
    import DialogAddTreatment from "$lib/DialogAddTreatment.svelte";
    import DialogEditTreatment from "$lib/DialogEditTreatment.svelte";

    import { dialogIsOpened, toggleDialog, editTreatmentDialogIsOpened } from "$lib/dialog";
    
    import type { Record } from "pocketbase";
    import { currentUser, pb } from "$lib/pocketbase";

    import { onDestroy, onMount } from 'svelte';
	import Header from "$lib/Header.svelte";

    let unsubscribe: () => void;

    let treatments: Record[] = [];

	onMount(async () => {
		if(!$currentUser) {
            console.log("redirecting");
            window.location.href = "/";
        } else {
            const resultList = await pb.collection('treatments').getList(1, 50, {
                sort: '-created',
                expand: 'disease'
            });
            treatments = resultList.items;
            unsubscribe = await pb.collection('treatments').subscribe('*', async ({action, record}) => {
                if (action === "create") {
                    const disease = await pb.collection('diseases').getOne(record.disease);
                    record.expand = { disease };
                    treatments = [record, ...treatments]; 
                }
                if (action === "update") {
                    const disease = await pb.collection ('diseases').getOne(record.disease);
                    record.expand = { disease };
                    const index = treatments.findIndex( treatment => treatment.id === record.id );
                    treatments[index] = record;
                    treatments = treatments;
                }
                if (action === "delete") {
                    treatments = treatments.filter((treatment) => treatment.id !== record.id);
                }
            });
        }
	});

    onDestroy(() => {
        unsubscribe?.();
    });
</script>

{#if $currentUser}
    <Header name={$currentUser.name} title="Behandlungen"/>

    <div class="body">
        <TreatmentCardContainer treatments={treatments}/>
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="add-treatment-btn" on:click={toggleDialog}>
        <div>
            +
        </div>
    </div>

    <Navbar currentPage="/home"/>

    {#if $dialogIsOpened}
        <DialogAddTreatment />
    {/if}

    {#if $editTreatmentDialogIsOpened}
        <DialogEditTreatment />
    {/if}
{/if}

<style>
    .body {
        margin-top: 110px;
        margin-bottom: 140px;
    }
    .add-treatment-btn {
        background-color: rgb(0, 157, 255);
        position: fixed;
        bottom: 80px;
        right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 72px;
        width: 72px;
        border-radius: 36px;
        color: rgb(30, 30, 30);
        font-size: 50px;
        font-weight: 500;
    }
</style>