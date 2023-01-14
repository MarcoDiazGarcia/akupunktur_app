<script>
	import Header from "$lib/Header.svelte";
	import Navbar from "$lib/Navbar.svelte";

	import { currentUser } from "$lib/pocketbase";
	import { onMount } from "svelte";

	onMount(async () => {
		if(!$currentUser) {
            console.log("redirecting");
            window.location.href = "/";
        } else {
            
        }
	});
</script>

{#if $currentUser}
    <Header name={$currentUser.name} title="Verwaltung"/>

	<Navbar currentPage="/points"/>
{/if}