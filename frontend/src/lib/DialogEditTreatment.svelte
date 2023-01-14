<script lang="ts">
    import type { Record } from "pocketbase";
    import { pb } from "$lib/pocketbase";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    import { treatmentToBeEdited, pointsToBeEdited, closeEditTreatmentDialog, openConfirmationDialog, dialogConfirmationIsOpened } from "$lib/dialog";
	import DialogConfirmation from "./DialogConfirmation.svelte";

    let allDiseases: Record[] = [];
    let allPoints: Record[]= [];

    let disease: string;
    let point: string;
    let points = writable([]);
    let pointsId: string[] = [];

    let oldDiseaseId: string;
    let oldEffectiveness: number;
    let existingPoints: string[] = [];
    let addedPointsId: string[] = [];
    let deletedPointsId: string[] = [];

    for (let p of pointsToBeEdited) {
        pointsId.push(p.point);
        $points.push(p.expand?.point?.point);
        existingPoints.push(p.point);
    }

    onMount(async () => {
        allDiseases = await pb.collection('diseases').getFullList(1000 , {});
        allPoints = await pb.collection('acupuncture_points').getFullList(1000 , {});
        disease = treatmentToBeEdited.expand?.disease?.disease;
        oldDiseaseId = allDiseases.filter(function(item) { return item.disease === disease; })[0].id;
        oldEffectiveness = treatmentToBeEdited.effectiveness;
    });

    function addPoint() {
        if (point) {
            if (!$points.includes(point)) {
                $points = [...$points, point];
                let found = allPoints.filter(function(item) { return item.point === point; });
                pointsId.push(found[0].id);

                if (deletedPointsId.includes(found[0].id)) {
                    const index = deletedPointsId.indexOf(found[0].id);
                    deletedPointsId.splice(index, 1);
                    existingPoints.push(found[0].id);
                } else {
                    addedPointsId.push(found[0].id);
                }
            }
        }
    }

    function removePoint(delPoint: string) {
        let index = $points.indexOf(delPoint);
        $points.splice(index, 1);
        const delPointId = pointsId.splice(index, 1)[0];
        $points = $points;

        if (addedPointsId.includes(delPointId)) {
            const index = addedPointsId.indexOf(delPointId);
            addedPointsId.splice(index, 1);
        } else {
            deletedPointsId.push(delPointId);
            const index = existingPoints.indexOf(delPointId);
            existingPoints.splice(index, 1);
        }
    }

    async function addPointForDiseaseEntry(diseaseId: string, pId: string, currentEffectiveness: number) {
        try {
            const filter: string = 'disease="' + diseaseId + '" && point="' + pId + '"';
            const pointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').getFirstListItem(filter, { '$autoCancel': false });

            let newAmountUsed = pointForDiseaseRecord.amount_used + 1;
            let sumEffectiveness = pointForDiseaseRecord.effectiveness * pointForDiseaseRecord.amount_used;
            sumEffectiveness += currentEffectiveness;
            const newEffectiveness =  sumEffectiveness / newAmountUsed;

            const data = {
                "effectiveness": newEffectiveness,
                "amount_used": newAmountUsed
            };

            const updatedPointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').update(pointForDiseaseRecord.id, data);
        } catch (err: any) {
            if (err.status === 404) {
                const data = {
                    "disease": diseaseId,
                    "point": pId,
                    "effectiveness": currentEffectiveness,
                    "amount_used": 1
                };

                const updatedPointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').create(data);
            }
        }
    }

    async function deletePointForDiseaseEntry(diseaseId: string, pId: string, previousEffectiveness: number) {
        const filter: string = 'disease="' + diseaseId + '" && point="' + pId + '"';
                const pointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').getFirstListItem(filter, {'$autoCancel': false });
                if (pointForDiseaseRecord.amount_used === 1) {
                    await pb.collection('acupuncture_points_for_diseases').delete(pointForDiseaseRecord.id);
                } else {
                    let newAmountUsed = pointForDiseaseRecord.amount_used - 1;
                    let sumEffectiveness = pointForDiseaseRecord.effectiveness * pointForDiseaseRecord.amount_used;
                    sumEffectiveness -= previousEffectiveness;
                    const newEffectiveness =  sumEffectiveness / newAmountUsed;

                    const data = {
                        "effectiveness": newEffectiveness,
                        "amount_used": newAmountUsed,
                    };

                    const updatedPointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').update(pointForDiseaseRecord.id, data);
                }
    }

    async function updatePointForDiseaseEntry(diseaseId: string, pId: string, previousEffectiveness: number, currentEffectiveness: number) {
        const filter: string = 'disease="' + diseaseId + '" && point="' + pId + '"';
        const pointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').getFirstListItem(filter, {'$autoCancel': false });
        let sumEffectiveness = pointForDiseaseRecord.effectiveness * pointForDiseaseRecord.amount_used;
        sumEffectiveness -= previousEffectiveness;
        sumEffectiveness += currentEffectiveness;
        const newEffectiveness =  sumEffectiveness / pointForDiseaseRecord.amount_used;

        const data = { "effectiveness": newEffectiveness };

        const updatedPointForDiseaseRecord = await pb.collection('acupuncture_points_for_diseases').update(pointForDiseaseRecord.id, data);
    }

    async function editTreatment() {
        addPoint();
        const diseaseId = allDiseases.filter(function(item) { return item.disease === disease; })[0].id;
        const data = {
            "horse_name": treatmentToBeEdited.horse_name,
            "disease": diseaseId,
            "effectiveness": treatmentToBeEdited.effectiveness,
            "physio": treatmentToBeEdited.physio,
            "description": treatmentToBeEdited.description
        };

        const updatedTreatmentRecord = await pb.collection('treatments').update(treatmentToBeEdited.id, data);

        for (let pId of deletedPointsId) {
            await deletePointForDiseaseEntry(oldDiseaseId, pId, oldEffectiveness);

            const filter: string = 'treatment="' + treatmentToBeEdited.id + '" && point="' + pId + '"';
            const treatmentPointRecord = await pb.collection('treatement_acupuncture_points').getFirstListItem(filter, {'$autoCancel': false });
            await pb.collection('treatement_acupuncture_points').delete(treatmentPointRecord.id);
        }

        for (let pId of addedPointsId) {
            await addPointForDiseaseEntry(diseaseId, pId, treatmentToBeEdited.effectiveness);

            const data = {
                "treatment": treatmentToBeEdited.id,
                "point": pId
            };

            const createdTreatmentPointRecord = await pb.collection('treatement_acupuncture_points').create(data);
        }

        if (oldEffectiveness !== treatmentToBeEdited.effectiveness && oldDiseaseId === diseaseId) {
            for (let pId of existingPoints) {
                await updatePointForDiseaseEntry(diseaseId, pId, oldEffectiveness, treatmentToBeEdited.effectiveness);
            }
        } else if (oldDiseaseId !== diseaseId) {
            for (let pId of existingPoints) {
                await deletePointForDiseaseEntry(oldDiseaseId, pId, oldEffectiveness);
    	        await addPointForDiseaseEntry(diseaseId, pId, treatmentToBeEdited.effectiveness);
            }
        }

        closeEditTreatmentDialog();
    }

    function openConfirmationDialogDeleteTreatment() {
        const deleteTreatment: Function = async () => {
            for (let p of pointsToBeEdited) {
                deletePointForDiseaseEntry(treatmentToBeEdited.disease, p.point, oldEffectiveness);
            }
            await pb.collection('treatments').delete(treatmentToBeEdited.id);
            closeEditTreatmentDialog();
        }
        openConfirmationDialog(deleteTreatment);
    }
</script>

<div class="dialog-bg-blur">
    <div class="dialog">
        <div class="head">
            <div class="title">
                Bearbeite Behandlung
            </div>
        </div>
        <form on:submit|preventDefault={editTreatment}>
            <div>
                <input type="text" class="input" required bind:value={treatmentToBeEdited.horse_name}/>
                <span class="floating-label">Name des Pferdes</span>
            </div>
            <div>
                <input type="text" class="input" required bind:value={disease} list="diseases"/>
                <span class="floating-label">Erkrankung</span>
            </div>
            <div>
                <input type="number" min="0" max="10" class="input" required bind:value={treatmentToBeEdited.effectiveness}/>
                <span class="floating-label">Effektivität</span>
            </div>
            <div>
                <textarea class="input" bind:value={treatmentToBeEdited.description}/>
                <span class="floating-label-ta">Beschreibung</span>
            </div>
            <div>
                <input type="text" class="input" bind:value={point} list="points"/>
                <span class="floating-label">Akupunkturpunkt</span>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="add-point" on:click={addPoint}>
                    <div>
                        +
                    </div>
                </div>
            </div>
            <div class="points">
                {#each $points as aPoint}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="point" on:click={() => removePoint(aPoint)}>
                        {aPoint}
                    </div>
                {/each}
            </div>
            <input type="button" class="delete-btn" value="Löschen" on:click={openConfirmationDialogDeleteTreatment}/>
            <div class="buttons">
                <input type="button" class="cancel-btn" value="Abbrechen" on:click={closeEditTreatmentDialog}/>
                <input type="submit" value="Bearbeiten"/>
            </div>
        </form>
    </div>
</div>

{#if $dialogConfirmationIsOpened}
    <DialogConfirmation
        title="Behandlung löschen"
        description="Sind Sie sich sicher, dass Sie die Behandlung löschen wollen?"
        denyDesc="behalten"
        confirmDesc="löschen"
    />
{/if}

<datalist id="diseases">
    {#each allDiseases as listDisease (listDisease.id)}
        <option>{listDisease.disease}</option>
    {/each}
</datalist>

<datalist id="points">
    {#each allPoints as listPoint (listPoint.id)}
        <option>{listPoint.point}</option>
    {/each}
</datalist>

<style>
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title {
        text-transform: uppercase;
        color: rgb(255, 0, 157);
        font-size: 24px;
        font-weight: 900;
        -webkit-transform:scale(1,1.6); /* Safari and Chrome */
        -moz-transform:scale(1,1.6); /* Firefox */
        -ms-transform:scale(1,1.6); /* IE 9 */
        -o-transform:scale(1,1.6); /* Opera */
        transform:scale(1,1.6); /* W3C */
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    div {
        position: relative;
    }

    .dialog-bg-blur {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        backdrop-filter: blur(10px);
    }

    .dialog {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        background-color: rgb(54,57,63);
        border-radius: 16px;
    }

    .buttons {
        display: flex;
        gap: 20px;
    }

    input[type="submit"] {
        background-color: rgb(0, 157, 255);
        height: 36px;
        width: 120px;
        border: 2px solid rgb(255, 255, 255, 0.7);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.8);
    }

    .cancel-btn {
        background-color: rgb(47, 49, 54);
        height: 36px;
        width: 120px;
        border: 2px solid rgb(255, 255, 255, 0.7);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7);
    }

    .delete-btn {
        margin-top: 10px;
        background-color: rgb(100, 0, 0);
        height: 36px;
        width: 260px;
        border: 2px solid rgb(190, 0, 0);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(190, 0, 0);
    }

    input:focus ~ .floating-label, input:not(:focus):valid ~ .floating-label, textarea:focus ~ .floating-label-ta, textarea:not(:focus):valid ~ .floating-label-ta{
        top: 8px;
        bottom: 10px;
        left: 20px;
        font-size: 11px;
        opacity: 1;
    }

    input:focus, textarea:focus {
        outline: none;
        background-color: rgb(32,34,37, 0.8);
    }
    
    .input {
        position: relative;
        height: 60px;
        width: 260px;
        background-color: rgb(32,34,37);
        border: none;
        border-radius: 8px;
        padding: 10px 20px 0 20px;
        font-size: 18px;
        color: rgb(201, 201, 201);
    }

    textarea {
        padding: 30px 20px 0 20px !important;
        margin-bottom: -6px;
    }

    .floating-label {
        position: absolute;
        color: rgb(135, 141, 153);
        pointer-events: none;
        left: 20px;
        top: 23px;
        transition: 0.2s ease all;
    }

    .floating-label-ta {
        position: absolute;
        color: rgb(135, 141, 153);
        pointer-events: none;
        left: 20px;
        top: 30px;
        transition: 0.2s ease all;
    }

    .add-point {
        background-color: rgb(255, 0, 157);
        position: absolute;
        top: 15px;
        right: 15px;
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        font-size: 28px;
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
</style>