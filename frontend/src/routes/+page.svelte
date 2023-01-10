<script lang="ts">
    import { currentUser, pb } from "$lib/pocketbase";

    let username: string;
    let password: string;

    async function login() {
        await pb.collection('users').authWithPassword(username, password);
    }

    function signOut() {
        pb.authStore.clear();
    }
</script>

<h1>Login</h1>

{#if $currentUser}
    <p>Signed in as {$currentUser.username}</p>
    <button on:click={signOut}>Sign Out</button>
{:else}
    <form on:submit|preventDefault>
        <input type="text" placeholder="Username" bind:value={username}/>
        <input type="password" placeholder="Password" bind:value={password}/>
    </form>
    <button on:click={login}>Login</button>
{/if}