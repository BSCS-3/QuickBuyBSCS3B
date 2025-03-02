<script lang="ts">
    let showModal = false;

    function toggleModal() {
        showModal = !showModal;
    }
</script>

<div class="bg-gradient-to-b from-white to-green-800 w-screen h-screen flex items-center justify-center">
    <button class="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer" on:click={toggleModal}>
        Cart
    </button>
</div>

{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);">
        <div class="bg-white p-8 rounded-lg shadow-lg text-center" style="width: 558px; height: 425px; display: flex; flex-direction: column; justify-content: space-between;">
            <h3 class="text-[60px] font-[500] text-[#21463E] font-dm-sans mt-13">Don't have an</h3>
            <h3 class="text-[60px] font-[500] text-[#21463E] font-dm-sans" style="margin-top: -100px; margin-bottom: -50px">account yet?</h3>
            <button class="bg-[#21463E] align-middle text-white p-3 rounded-xl shadow-md hover:bg-[#1f2e2b] transition w-[70%] mx-auto text-2xl font-semibold mt-3">Register now</button>
            <p class="mt-4 text-gray-600">already have an account? <span class="text-blue-600 cursor-pointer">login.</span></p>
        </div>
    </div>
{/if}
