<script lang="ts">
    import { currentUser, pb } from "$lib/pocketbase";

    let username: string;
    let password: string;

    async function login() {
        await pb.collection('users').authWithPassword(username, password);
        window.location.href = "/home";
    }

</script>

<div class="login">
    <h1>Login</h1>

    <form on:submit|preventDefault>
        <div>
            <input type="text" class="inputText" required bind:value={username}/>
            <span class="floating-label">Username</span>
        </div>
        <div>
            <input type="password" class="inputText" required bind:value={password}/>
            <span class="floating-label">Password</span>
        </div>
    </form>
    <button on:click={login}>Login</button>
</div>

<style>
    .login {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
    h1 {
        margin: 0;
        padding: 0;
        color: rgb(255, 0, 157);
        text-transform: uppercase;
        text-align: center;
        font-size: 4em;
        font-weight: 800;
    }
    form {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    button {
        height: 3.5em;
        width: 50vw;
        background-color: rgb(255, 0, 157);
        border: rgb(32,34,37) solid 3px;
        border-radius: 2em;
        color: rgb(32,34,37);
        font-weight: 800;
        text-transform: uppercase;
        font-size: 1em;
    }
    div {
        position: relative;
    }
    input:focus ~ .floating-label, input:not(:focus):valid ~ .floating-label{
        top: 10px;
        bottom: 10px;
        left: 2em;
        font-size: 11px;
        opacity: 1;
    }
    input:focus {
        outline: none;
        background-color: rgb(32,34,37, 0.8);
    }

    .inputText {
        position: relative;
        height: 4em;
        width: 70vw;
        background-color: rgb(32,34,37);
        border: none;
        border-radius: .4em;
        padding: 0 1em;
        font-size: 1.3em;
        color: rgb(201, 201, 201);
    }

    .floating-label {
        position: absolute;
        color: rgb(135, 141, 153);
        pointer-events: none;
        left: 20px;
        top: 1.8em;
        transition: 0.2s ease all;
    }
</style>