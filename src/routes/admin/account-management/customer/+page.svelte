<script lang="ts">
    import { UsersStore } from "$lib/stores/user.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { formatDate } from "$lib/pipes/date.js";

    let loading = true;
    let deleteLoading = false;

    onMount(async () => {
        try {
            await UsersStore.loadUsers();
        } finally {
            loading = false;
        }
    });

    async function handleDelete(userId: string) {
        deleteLoading = true;
        try {
            await UsersStore.deleteUser(userId);
        } catch (error) {
            alert("Failed to delete user");
        } finally {
            deleteLoading = false;
        }
    }

    $: customers = $UsersStore.filter((user) => user.role === "customer");
</script>

<main>
    <h1 class="text-[#21463E] text-3xl font-bold">Account Management</h1>
    <!-- users tab -->
    <div class="flex justify-between items-center gap-1 bg-[#EFEFEF99] w-3/5 p-2 rounded-2xl mt-4">
        <button class="w-1/2 bg-white p-2 text-sm text-[#21463E] font-medium rounded-lg cursor-pointer">
            Customer
        </button>

        <button class="w-1/2 p-2 text-sm text-[#686868] font-medium rounded-lg cursor-pointer hover:bg-[#EFEFEF]"
            on:click={()=>goto("/admin/account-management/seller")} >
            Seller
        </button>
    </div>

    <!-- customer table -->
    <div class="w-3/5 space-y-3">
        <!-- table head -->
        <div class="flex justify-between items-center bg-[#EFEFEFCC] border border-[#E2E2E2] p-2 rounded-lg mt-4 mb-4">
            <div class="flex items-center gap-2 text-sm p-1 w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#686868" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round">
                    <circle cx="12" cy="8" r="5"/>
                    <path d="M20 21a8 8 0 0 0-16 0"/>
                </svg>
                <p class="text-[#686868]">username</p>
            </div>
            <div class="flex items-center gap-2 text-sm w-3/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#686868" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <p class="text-[#686868]">email</p>
            </div>
            <div class="flex items-center gap-2 text-sm p-1 w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#686868" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p class="text-[#686868]">created at</p>
            </div>
            <div class="flex items-center gap-2 text-sm p-1 w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#686868" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bolt">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <circle cx="12" cy="12" r="4"/>
                </svg>
                <p class="text-[#686868]">actions</p>
            </div>
        </div>

        <!-- table content -->
        <div class="space-y-2 overflow-y-auto max-h-[calc(100vh-320px)]">
        {#if customers.length === 0}
            <div class="flex justify-between items-center border border-[#D44C47]/40 bg-[#FDEBEC] p-2 rounded-lg">
                <p class="text-[#D44C47] text-sm p-1">no customer found.</p>
            </div>
        {:else}
            {#each customers as user}
            <div class="flex justify-between items-center border border-[#E2E2E2] p-1 rounded-lg">
                <div class="flex items-center gap-2 text-sm p-1 w-1/3">
                    <div class="w-5 h-5 rounded-full bg-[#efefef]"></div>
                    <p class="text-[#21463E]">{user.username}</p>
                </div>
                <div class="flex items-center text-sm w-3/5">
                    <p class="text-[#21463E]">{user.email}</p>
                </div>
                <div class="flex items-center text-sm p-1 w-1/3">
                    <p class="text-[#21463E]">{formatDate(user.created_at)}</p>
                </div>
                <div class="flex items-center text-sm p-1 w-1/3">
                    <button class="bg-[#FDEBEC] text-[#D44C47] px-4 py-2 rounded-lg text-xs w-full cursor-pointer hover:bg-[#D44C47]/20"
                        on:click={() => handleDelete(user.id)} 
                        disabled={deleteLoading} >
                        {deleteLoading ? "deleting..." : "delete"}
                    </button>
                </div>
            </div>
            {/each}
        {/if}
        </div>
    </div>
</main>
