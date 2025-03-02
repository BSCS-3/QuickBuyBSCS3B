<script lang="ts">
    let showModal = false;
    let showPopup = false;
    let countdown = 5; // Countdown duration
    let interval: NodeJS.Timeout;

    function toggleModal() {
        showModal = !showModal;
        showPopup = true;
        countdown = 5; // Reset countdown
        interval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(interval);
                showPopup = false;
            }
        }, 1000);
    }

    // Cleanup interval on component destroy
    import { onDestroy } from 'svelte';
    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<div class="bg-gradient-to-b from-white to-green-800 w-screen h-screen flex items-center justify-center">
    <button class="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer" on:click={toggleModal}>
        Cart
    </button>
</div>

{#if showPopup}
    <div class="fixed top-0 left-0 right-0 flex items-center justify-center mt-5" style="z-index: 1000;">
        <div class="bg-white text-white p-6 rounded-lg shadow-lg text-center mb-4 border-t-4 border-[#21463E] relative">
            <div class="justify-center flex items-center">
                <div class="relative w-12 h-12">
                    <svg class="absolute inset-0" viewBox="0 0 36 36">
                        <path class="text-gray-300" fill="none" stroke-width="3" stroke="currentColor" d="M18 1.5A16.5 16.5 0 1 1 1.5 18A16.5 16.5 0 0 1 18 1.5" />
                        <path class="text-[#21463E]" fill="none" stroke-width="3" stroke="currentColor" stroke-dasharray="100" stroke-dashoffset="{(countdown / 5) * 100}" d="M18 1.5A16.5 16.5 0 1 1 1.5 18A16.5 16.5 0 0 1 18 1.5" />
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#21463E]">X</span>
                </div>
            </div>
            <h3 class="text-2xl font-bold text-[#21463E] relative" style="margin-top: 1.5rem;">ACCOUNT NOT LOGGED IN</h3>
            <p class="text-gray-400">No logged in account found to do the desired action</p>
        </div>
    </div>
{/if}

{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); z-index: 999;">
        <div class="bg-white p-8 rounded-lg shadow-lg text-center" style="width: 558px; height: 425px; display: flex; flex-direction: column; justify-content: space-between;">
            <h3 class="text-[60px] font-[500] text-[#21463E] font-dm-sans mt-13">Don't have an</h3>
            <h3 class="text-[60px] font-[500] text-[#21463E] font-dm-sans" style="margin-top: -100px; margin-bottom: -50px">account yet?</h3>
            <button class="bg-[#21463E] align-middle text-white p-3 rounded-xl shadow-md hover:bg-[#1f2e2b] transition w-[70%] mx-auto text-2xl font-semibold mt-3" on:click={() => window.location.href = "/register/customer"} >
                Register now
            </button>
            <p class="mt-4 text-gray-600">already have an account? <span class="text-blue-600 cursor-pointer" role="button" on:click={() => window.location.href = "/login"} on:keydown={() => window.location.href = "/login"} tabindex="0">login.</span></p>
        </div>
    </div>
{/if}
