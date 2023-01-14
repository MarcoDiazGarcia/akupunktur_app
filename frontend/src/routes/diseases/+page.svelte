<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Navbar from "$lib/Navbar.svelte";
	import MdKeyboardArrowDown from 'svelte-icons/md/MdKeyboardArrowDown.svelte'
	import MdKeyboardArrowUp from 'svelte-icons/md/MdKeyboardArrowUp.svelte'

	import { currentUser, pb } from "$lib/pocketbase";
	import { onMount } from "svelte";

	import { SortDiseaseByOptions, type Disease, type Point } from "$lib/interfaces";
	import DiseaseCardContainer from "$lib/DiseaseCardContainer.svelte";
	import { writable, type Writable } from "svelte/store";

	let diseaseFilter: string = "";
	let pointFilter: string = "";

	let diseases: Disease[] = [];
	let displayedDiseases: Writable<Disease[]> = writable([]);

	let sortOptions = writable({
		"sortBy": SortDiseaseByOptions.AmountUsed,
		"descending": true 
	});
	
	onMount(async () => {
		if(!$currentUser) {
            console.log("redirecting");
            window.location.href = "/";
        } else {
            await getDiseases();
		}
	});

	const sort_by = (field: string, reverse: any, primer: Function) => {

		const key = primer ?
		function(x) {
			return primer(x[field])
		} :
		function(x) {
			return x[field]
		};

		reverse = !reverse ? 1 : -1;

		return function(a: any, b: any) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	}

	function sortDiseases(sortBy: SortDiseaseByOptions) {
		if ($sortOptions.sortBy === sortBy) {
			$sortOptions.descending = !$sortOptions.descending;
		} else {
			$sortOptions.sortBy = sortBy;
			$sortOptions.descending = true;
		}

		let primer: Function;

		if ( $sortOptions.sortBy === SortDiseaseByOptions.Point ) {
			primer = (a: string) => a.toUpperCase();
		} else {
			primer = parseInt;
		}

		for (let i = 0; i < $displayedDiseases.length; i++) {
			$displayedDiseases[i].points = $displayedDiseases[i].points.sort(sort_by($sortOptions.sortBy, $sortOptions.descending, primer));
		}
	}

	async function getDiseases() {
		diseases = [];
		let diseasesRecords = await pb.collection('diseases').getFullList(1000 , {
			sort: 'disease',
		});

		diseasesRecords = diseasesRecords.filter((diseaseRecord) => { return diseaseRecord.disease.toLowerCase().includes(diseaseFilter.toLowerCase())});

		for (const diseaseRecord of diseasesRecords) {
			const filter = 'disease="' + diseaseRecord.id + '"';
			const pointForDiseaseRecords = await pb.collection('acupuncture_points_for_diseases').getFullList(1000 , {
				filter: filter,
				sort: '-amount_used',
				expand: 'point'
			});

			let points: Point[] = [];

			for (let pointForDiseaseRecord of pointForDiseaseRecords) {
				if (pointForDiseaseRecord.expand?.point?.point.toLowerCase().includes(pointFilter.toLowerCase())) {
					const point = {
						"id": pointForDiseaseRecord.point,
						"point": pointForDiseaseRecord.expand?.point?.point,
						"effectiveness": pointForDiseaseRecord.effectiveness,
						"amountUsed": pointForDiseaseRecord.amount_used
					};
					points.push(point);
				}
			}

			const disease = { 
				"id": diseaseRecord.id,
				"disease": diseaseRecord.disease,
				"points": points
			};

			diseases.push(disease);
		}
		$displayedDiseases = diseases;
	}
</script>

{#if $currentUser}
    <Header name={$currentUser.name} title="Erkrankungen"/>

	<div class="search-container">
		<form>
			<div>
                <input type="text" placeholder=" " class="input" bind:value={diseaseFilter} on:input={getDiseases}/>
                <span class="floating-label">Erkrankung</span>
            </div>
			<div>
                <input type="text" placeholder=" " class="input" bind:value={pointFilter} on:input={getDiseases}/>
                <span class="floating-label">Akupunkturpunkt</span>
            </div>
		</form>
		<div class="sort">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="sort-elem" on:click={() => sortDiseases(SortDiseaseByOptions.Point)}>
				<div class="sort-elem-title">
					Punkt
				</div>
				{#if $sortOptions.sortBy === SortDiseaseByOptions.Point}
					<div class="sort-elem-arrow">
						{#if $sortOptions.descending}
							<MdKeyboardArrowDown/>
						{:else}
							<MdKeyboardArrowUp/>
						{/if}
					</div>
				{/if}
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="sort-elem" on:click={() => sortDiseases(SortDiseaseByOptions.AmountUsed)}>
				<div class="sort-elem-title">
					Anzahl
				</div>
				{#if $sortOptions.sortBy === SortDiseaseByOptions.AmountUsed}
					<div class="sort-elem-arrow">
						{#if $sortOptions.descending}
							<MdKeyboardArrowDown/>
						{:else}
							<MdKeyboardArrowUp/>
						{/if}
					</div>
				{/if}
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="sort-elem" on:click={() => sortDiseases(SortDiseaseByOptions.Effectiveness)}>
				<div class="sort-elem-title">
					Effektiv
				</div>
				{#if $sortOptions.sortBy === SortDiseaseByOptions.Effectiveness}
					<div class="sort-elem-arrow">
						{#if $sortOptions.descending}
							<MdKeyboardArrowDown/>
						{:else}
							<MdKeyboardArrowUp/>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="body">
		<DiseaseCardContainer diseases={$displayedDiseases}/>
	</div>

	<Navbar currentPage="/diseases"/>
{/if}

<style>
	div {
        position: relative;
    }

	.search-container {
		background-color: rgb(54,57,63);
		position: fixed;
        top: 116px;
		padding: 10px 20px;
		width: 100vw;
		display: flex;
		flex-direction: column;
		gap: 10px;
		border-bottom: 4px solid rgb(30, 30, 30);
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
		z-index: 100;
    }

	.sort {
		display: flex;
		justify-content: space-around;
	}

	.sort-elem {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px;
		width: 80px;
		height: 18px;
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 4px;
		color: rgb(30,30,30);
		font-weight: 500;
	}

	.sort-elem-arrow {
		height: 24px;
		width: 24px;
	}

	.body {
		position: relative;
		margin-top: 230px;
		padding: 20px;
	}

	form {
		display: flex;
		justify-content: space-between;
	}	

	input:focus ~ .floating-label, input:not(:focus):not(:placeholder-shown) ~ .floating-label {
        top: 8px;
        bottom: 10px;
        left: 20px;
        font-size: 8px;
        opacity: 1;
    }

    input:focus, textarea:focus {
        outline: none;
        background-color: rgb(32,34,37, 0.8);
    }
    
    .input {
        position: relative;
        height: 36px;
        width: 125px;
        background-color: rgb(32,34,37);
        border: none;
        border-radius: 8px;
        padding: 10px 20px 0 20px;
        font-size: 18px;
        color: rgb(201, 201, 201);
    }

	.floating-label {
        position: absolute;
        color: rgb(135, 141, 153);
        pointer-events: none;
        left: 12px;
        top: 11px;
        transition: 0.2s ease all;
    }
</style>
