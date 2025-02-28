<script lang="ts">
    import { slide } from 'svelte/transition';
  
    let expandedItems = new Set();
    let isMinimized = false;
  
    function toggleItem(itemLabel: string) {
      if (expandedItems.has(itemLabel)) {
        expandedItems.delete(itemLabel);
      } else {
        expandedItems.add(itemLabel);
      }
      expandedItems = new Set(expandedItems); // trigger reactivity
    }
  
    function toggleSidebar() {
      isMinimized = !isMinimized;
      expandedItems = new Set(); // Close all open menus when minimized
    }
  
    export let items = [
      { label: 'Dashboard', icon: '/assets/icons/dashboard.svg', link: '#' },
      { label: 'User Accounts', icon: '/assets/icons/users.svg', link: '#', subItems: [
        { label: 'Customers', link: '#' },
        { label: 'Sellers', link: '#', subItems: [
          { label: 'Approved', link: '#' },
          { label: 'Pending Approval', link: '#' },
          { label: 'Not Approved', link: '#' }
        ]}
      ]}
    ];
  </script>
  
  <!-- Sidebar Container -->
  <div class={`${isMinimized ? 'w-16' : 'w-64'} bg-white h-screen transition-all duration-300 flex flex-col`}>
    <!-- Sidebar Header -->
    <div class="p-4 flex items-center">
      {#if !isMinimized}
        <!-- Show Logo when Expanded -->
        <h1 class="text-xl font-semibold flex items-center flex-grow">
          <img src="/assets/icons/logo.svg" alt="logo" class="w-6 h-6 mr-2" />
          <span class="text-[#21463E] font-extrabold text-medium">Quick</span>
          <span class="font-bold text-[#686868] text-medium">Buy</span>
        </h1>
      {/if}
  
      <!-- Hamburger Button (Always Visible) -->
      <button 
        class="p-2 hover:bg-gray-100 rounded-full ml-auto"
        on:click={toggleSidebar}
      >
        <span class="text-xl flex items-center justify-center w-5 h-5">☰</span>
      </button>
    </div>
  
    <!-- Sidebar Items -->
    {#if !isMinimized}  
      <ul class="mt-4">
        {#each items as item}
          <li>
            <button
              class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-[#21463E]/10 hover:text-[#21463E] transition-all duration-200 ease-in-out cursor-pointer rounded-lg group"
              on:click={() => toggleItem(item.label)}
            >
              <span class="mr-2 group-hover:scale-110 transition-transform duration-200">
                <img src={item.icon} alt={item.label} class="w-5 h-5" />
              </span>
              <span>{item.label}</span>
              {#if item.subItems}
                <span class="ml-auto">
                  <img 
                    src={expandedItems.has(item.label) ? '/assets/icons/chevron-down.svg' : '/assets/icons/chevron-right.svg'} 
                    alt={expandedItems.has(item.label) ? 'Collapse' : 'Expand'} 
                    class="w-4 h-4"
                  />
                </span>
              {/if}
            </button>
  
            {#if item.subItems && expandedItems.has(item.label)}
              <ul transition:slide class="ml-4">
                {#each item.subItems as subItem}
                  <li>
                    <button
                      class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-[#21463E]/10 hover:text-[#21463E] transition-all duration-200 ease-in-out cursor-pointer rounded-lg group"
                      on:click={() => toggleItem(subItem.label)}
                    >
                      <span>{subItem.label}</span>
                      {#if subItem.subItems}
                        <span class="ml-auto">
                          <img 
                            src={expandedItems.has(subItem.label) ? '/assets/icons/chevron-down.svg' : '/assets/icons/chevron-right.svg'} 
                            alt={expandedItems.has(subItem.label) ? 'Collapse' : 'Expand'} 
                            class="w-4 h-4"
                          />
                        </span>
                      {/if}
                    </button>
  
                    {#if subItem.subItems && expandedItems.has(subItem.label)}
                      <ul transition:slide class="ml-4">
                        {#each subItem.subItems as subSubItem}
                          <li>
                            <a
                              href={subSubItem.link}
                              class="block w-full px-4 py-2 text-gray-700 hover:bg-[#21463E]/10 hover:text-[#21463E] transition-all duration-200 ease-in-out rounded-lg"
                            >
                              {subSubItem.label}
                            </a>
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}  
  </div>
  