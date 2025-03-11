<script>
    import { goto } from '$app/navigation';
  
    let showModal = true;
    
    async function handleLogout() {
      try {
        const response = await fetch('http://localhost:3000/api/logout', {
          method: 'POST',
          credentials: 'include',
        });
  
        if (response.ok) {
          showModal = false;
          goto('/login');
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    function handleCancel() {
      showModal = false;
      goto('/');
    }
</script>

<main class="px-10 py-6">
    <header class="flex justify-between items-center w-full">
        <h1 class="text-[#21463E] font-extrabold text-3xl">
            Quick<span class="text-[#999999]">Buy</span>
        </h1>
        <button class="bg-[#FDEBEC] text-[#D44C47] px-4 py-2 rounded-lg text-sm w-40 cursor-pointer hover:bg-[#D44C47]/20"
            on:click={handleLogout} >
            Log Out
        </button>
    </header>
    
    <slot>
      <!-- content goes here -->
    </slot>
</main>