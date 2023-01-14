<script lang="ts">
    import { closeConfirmationDialog } from "$lib/dialog";

    export let title: string;
    export let description: string;
    export let denyDesc: string;
    export let confirmDesc: string;

    function confirm() {
        closeConfirmationDialog(true);
    }

    function deny() {  
        closeConfirmationDialog(false);
    }
</script>

<div class="dialog-bg-blur">
    <div class="dialog">
        <div class="title">
            {title}
        </div>
        <div class="description">
            {description}
        </div>
        <div class="buttons">
            <button class="btn-deny" on:click={deny}>
                Nein, {denyDesc}!
            </button>
            <button class="btn-confirm" on:click={confirm}>
                Ja, {confirmDesc}!
            </button>
        </div>
    </div>
</div>

<style>
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
        width: 280px;
        background-color: rgb(54,57,63);
        border-radius: 16px;
    }

    .title {
        text-transform: uppercase;
        color: rgb(255, 0, 157);
        font-size: 22px;
        font-weight: 900;
        -webkit-transform:scale(1,1.6); /* Safari and Chrome */
        -moz-transform:scale(1,1.6); /* Firefox */
        -ms-transform:scale(1,1.6); /* IE 9 */
        -o-transform:scale(1,1.6); /* Opera */
        transform:scale(1,1.6); /* W3C */
    }

    .description {
        color: rgb(255, 255, 255, 0.7);
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .btn-deny {
        background-color: rgb(47, 49, 54);
        height: 48px;
        width: 120px;
        border: 2px solid rgb(255, 255, 255, 0.7);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.7);
    }

    .btn-confirm {
        background-color: rgb(0, 157, 255);
        height: 48px;
        width: 120px;
        border: 2px solid rgb(255, 255, 255, 0.7);
        border-radius: 18px;
        text-transform: uppercase;
        font-weight: 800;
        color: rgb(255, 255, 255, 0.8);
    }
</style>