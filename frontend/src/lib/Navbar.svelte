<script lang="ts">
    import FaHome from 'svelte-icons/fa/FaHome.svelte';
    import FaCrutch from 'svelte-icons/fa/FaCrutch.svelte';
    import FaBiohazard from 'svelte-icons/fa/FaBiohazard.svelte'

    export let currentPage: string;

    function openPage(href: string) {
        window.location.href = href;
    }
</script>

<div class="navbar">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="icon {currentPage === "/points" ? "selected" : ""}" id="points" on:click={() => openPage("/points")}>
        <FaCrutch/>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="icon {currentPage === "/home" ? "selected" : ""}" id="home" on:click={() => openPage("/home")}>
        <FaHome/>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="icon {currentPage === "/diseases" ? "selected" : ""}" id="diseases" on:click={() => openPage("/diseases")}>
        <FaBiohazard/>
    </div>
</div>

<style>
    .navbar {
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: rgb(47, 49, 54);
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 60px;
        width: 100vw;
        z-index: 100;
    }

    .icon.selected {
        color: rgb(0, 157, 255);
        background-color: rgb(30, 30, 30);
    }

    .icon {
        color: rgb(255, 0, 157);
        height: 36px;
        width: 36px;
        padding: 6px 30px;
        border-radius: 12px;
    }
</style>