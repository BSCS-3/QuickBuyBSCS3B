<script>
    export let user = { 
      name: "Admin Admin", 
      username: "@Admin", 
      avatar: "https://storage.googleapis.com/a1aa/image/qxC7q4bJinYp2NS5QnyvX4MgHvaQSBDKpawY76JTJBQ.jpg" 
    };

    let searchQuery = '';

    function handleProfileClick() {
        console.log("Profile clicked"); // Replace this with navigation logic if needed
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</svelte:head>

<div class="flex justify-between items-center p-4 bg-white shadow-md">
    <div class="flex items-center">
        <!-- <button 
            class="text-gray-600 mr-4 hover:text-gray-800 transition-colors duration-200" 
            on:click
            aria-label="Toggle Sidebar">
            <i class="fas fa-bars text-xl"></i>
        </button> -->
        <div class="relative flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <i class="fas fa-search text-gray-400"></i>
            <input 
                bind:value={searchQuery}
                on:keydown={(e) => e.key === 'Enter' && dispatchEvent(new CustomEvent('search', { detail: { query: searchQuery } }))} 
                class="bg-transparent ml-2 outline-none placeholder-gray-500 text-gray-800 w-48" 
                placeholder="Search here..." 
                type="text" 
            />
        </div>
    </div>
    <div class="flex items-center">
        <button class="text-gray-600 mr-6 hover:text-gray-800 relative" aria-label="Notifications">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
        </button>
        <div 
            class="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2"
            on:click={handleProfileClick}
        >
            <img 
                class="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" 
                src={user.avatar} 
                alt={user.name} 
            />
            <div>
                <p class="text-gray-800 font-semibold">{user.name}</p>
                <p class="text-gray-600 text-sm">{user.username}</p>
            </div>
        </div>
    </div>
</div>
