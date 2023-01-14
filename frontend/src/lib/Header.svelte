<script lang="ts">
    import MdExitToApp from 'svelte-icons/md/MdExitToApp.svelte'

	import { pb } from "./pocketbase";

    export let title: string;
    export let name: string;

    function signOut() {
        pb.authStore.clear();
        window.location.href = "/";
    }
</script>

<div class="title-container">
    <div class="welcome-container">
        <div class="welcome-msg">
            Hallo {name}!
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="icon" on:click={signOut}>
            <MdExitToApp/>
        </div>
    </div>
    <div class="title">
        {title}
    </div>
</div>

<style>
    .title-container {
        position: fixed;
        top: 0;
        width: 100vw;
        background-color: rgb(47, 49, 54);
        display: flex;
        flex-direction: column;
        padding: 20px;
        padding-bottom: 10px;
        border-bottom: 4px solid rgb(30, 30, 30);
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
        z-index: 100;
    }
    .welcome-container {
        display: flex;
        justify-content: space-between;
    }
    .welcome-msg {
        font-size: 16px;
        color: rgb(255, 255, 255, 0.7);
    }
    .title {
        color: rgb(255, 0, 157);
        text-transform: uppercase;
        font-size: 38px;
        font-weight: 900;
    }
    .icon {
        height: 24px;
        width: 24px;
        color: rgb(255, 255, 255, 0.7);
    }
</style>