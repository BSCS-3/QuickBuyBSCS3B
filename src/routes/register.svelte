<script>
  import { goto } from '$app/navigation';
  
  let role = "customer";
  let username = "";
  let shopname = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let errorMessage = "";

  async function submitForm() {
    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    const userData = { username, email, password, role };

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        errorMessage = data.message || "Registration failed!";
        return;
      }

      const data = await response.json();
      alert("Registration successful!");
      
      // Clear the input fields
      shopname = "";
      username = "";
      email = "";
      password = "";
      confirmPassword = "";
      errorMessage = "";
      
      // Redirect to logout page
      goto('/logout');
      
    } catch (error) {
      console.error("Registration error:", error);
      errorMessage = "Connection error - please try again";
    }
  }
</script>

<main class="flex justify-center items-center h-screen bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-96">
    <h1 class="text-center text-2xl font-bold text-green-900">logo.</h1>
    <p class="text-center text-gray-500 mb-4 font-sans">Please, select your role and sign up to continue.</p>

    <div class="flex justify-center mb-4">
      <button 
        class="px-4 py-2 w-1/2 border rounded-l-lg text-xs" 
        class:bg-green-500={role === 'customer'} 
        class:text-white={role === 'customer'}
        on:click={() => role = 'customer'}>
        Customer
      </button>
      <button 
        class="px-2 py-2 w-1/2 border rounded-r-lg text-xs" 
        class:bg-green-500={role === 'seller'}
        class:text-white={role === 'seller'}
        on:click={() => role = 'seller'}>
        Seller
      </button>
    </div>

    <input type="text" placeholder="shop name" bind:value={shopname} class="w-full mb-2 p-2 border rounded" />
    <input type="text" placeholder="Username" bind:value={username} class="w-full mb-2 p-2 border rounded" />
    <input type="email" placeholder="Email" bind:value={email} class="w-full mb-2 p-2 border rounded" />
    <input type="password" placeholder="Password" bind:value={password} class="w-full mb-2 p-2 border rounded" />
    <input type="password" placeholder="Confirm Password" bind:value={confirmPassword} class="w-full mb-4 p-2 border rounded" />

    {#if errorMessage}
      <p class="text-red-500 text-sm text-center mb-2">{errorMessage}</p>
    {/if}
    
    <button on:click={submitForm} class="w-full bg-green-500 text-white py-2 rounded cursor-pointer">Continue →</button>

    <p class="text-center mt-4 text-gray-600">
      Already have an account? 
      <button
        on:click={() => goto('/login')}
        class="text-green-500 hover:text-green-600"
      >
        Login
      </button>
    </p>
  </div>
</main>
