<script lang="ts">
    import { toggleDialog } from "$lib/dialog";
    import type { ClientResponseError, Record } from "pocketbase";
    import { currentUser, pb } from "$lib/pocketbase";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    let treatmentId: string;
    let diseaseId: string;
    let pointsId: string[] = [];

    let allDiseases: Record[] = [];
    let allPoints: Record[]= [];

    let horse_name: string;
    let disease: string;
    let point: string;
    let points = writable([]);
    let description: string;

    onMount(async () => {
        allDiseases = await pb.collection('diseases').getFullList(1000 , {});
        allPoints = await pb.collection('acupuncture_points').getFullList(1000 , {});
    });

    function addPoint() {
        if (point) {
            if (!$points.includes(point)) {
                let found = allPoints.filter(function(item) { return item.point.toLowerCase() === point.toLowerCase(); });
                if (found.length > 0) {
                    pointsId.push(found[0].id);
                    $points = [...$points, found[0].point];
                }
            }
        }
    }

    function removePoint(delPoint: string) {
        let index = $points.indexOf(delPoint);
        $points.splice(index, 1);
        pointsId.splice(index, 1);
        $points = $points;
    }

    async function createTreatment() {
        addPoint();
        diseaseId = allDiseases.filter(function(item) { return item.disease === disease; })[0].id;

        const treatmentData = {
            "horse_name": horse_name,
            "disease": diseaseId,
            "physio": $currentUser?.id,
            "description": description
        };

        const treatmentRecord = await pb.collection('treatments').create(treatmentData);
        treatmentId = treatmentRecord.id;

        for (let pointId of pointsId) {
            const treatmentPointData = {
                "treatment": treatmentId,
                "point": pointId
            }

            //SEC: String concat
            const filter = 'disease="' + diseaseId + '" && point="' + pointId + '"';
            try {
                const record = await pb.collection('acupuncture_points_for_diseases').getFirstListItem(filter, {});
                const data = {
                    "disease": record.disease,
                    "point": record.point,
                    "effectiveness": record.effectiveness,
                    "amount_used": record.amount_used + 1
                };

                const updatedRecord = await pb.collection('acupuncture_points_for_diseases').update(record.id, data);
            } catch (err: any) {
                if (err.status === 404) {
                    const data = {
                        "disease": diseaseId,
                        "point": pointId,
                        "effectiveness": 0,
                        "amount_used": 1
                    };

                    const record = await pb.collection('acupuncture_points_for_diseases').create(data);
                }
            }

            const treatmentPointRecord = await pb.collection('treatement_acupuncture_points').create(treatmentPointData);
        }

        toggleDialog();
    }
</script>

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

<div class="dialog-bg-blur">
    <div class="dialog">
        <div class="head">
            <div class="title">
                Neue Behandlung
            </div>
        </div>
        <form on:submit|preventDefault={createTreatment}>
            <div>
                <input type="text" class="input" required bind:value={horse_name}/>
                <span class="floating-label">Name des Pferdes *</span>
            </div>
            <div>
                <input type="text" class="input" required bind:value={disease} list="diseases"/>
                <span class="floating-label">Erkrankung *</span>
            </div>
            <div>
                <textarea class="input" bind:value={description}/>
                <span class="floating-label-ta">Beschreibung</span>
            </div>
            <div>
                <input type="text" class="input" required bind:value={point} list="points"/>
                <span class="floating-label">Akupunkturpunkt *</span>
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
            <div class="buttons">
                <input type="button" value="Abbrechen" on:click={toggleDialog}/>
                <input type="submit" value="Erstellen"/>
            </div>
        </form>
    </div>
</div>

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

    .buttons {
        padding-top: 10px;
        display: flex;
        gap: 20px;
    }

    input[type="button"] {
        background-color: rgb(47, 49, 54);
        height: 36px;
        width: 120px;
        border: 2px solid rgb(255, 255, 255, 0.7);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7);
    }
</style>