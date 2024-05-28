<!-- src/routes/index.svelte -->

<script>
  import { Link } from "svelte-routing";
  import Home from "./home.svelte";
  import VChart from "./v_chart.svelte";

  let satelliteData = [
    { name: "ACE", position: "L1", status: "Active" },
    { name: "DSCOVR", position: "L1", status: "Active" },
  ];

  // Create a variable to track which component to display
  let displayHome = false;
  let displayIndex = true; // Display the index component by default

  // Function to display the Home component
  function showHome() {
    displayHome = true;
    displayIndex = false;
    s;
  }

  // Function to display the index.svelte component
  function showIndex() {
    displayHome = false;
    displayIndex = true;
  }
</script>

<main class="bg m-10">
  <div class="w-full flex justify-between items-start mt-5">
    <div
      class="flex space-x-10 border-b border-t border-white/30 py-2 items-center w-[83%]"
    >
      <!-- <h1
        class="text-white text-2xl items-center bg-gradient-to-b from-transparent via-transparent to-slate-700 p-3 border-r"
        style="font-family: 'Jura', sans-serif;"
      >
        Recon Solar Shield Initiative
      </h1> -->
      <img src="logo.png" alt="" class="w-[16rem] opacity-80" />
      <div class="space-x-5 border-l pl-5">
        <!-- Link to show the Home component -->
        <button
          id="home-button"
          on:click={showHome}
          class="text-xs focus:scale-110 focus:border-b focus:border-[#1df2f0]"
        >
          Main
        </button>
        <!-- Button to show the Chart component -->
        <button
          on:click={showIndex}
          class="text-xs focus:scale-110 focus:border-b focus:border-[#1df2f0]"
        >
          Visualization
        </button>

        <!-- Route to Twitter -->
        <a href="https://twitter.com/RssiSpaceApps23" target="_blank">
          <i class="fa-brands fa-x-twitter" style="color: #1df2f0"></i>
        </a>
      </div>
    </div>
    <div class="">
      <h2
        class="uppercase grid border-b border-white/30 bg-[#132E27] py-2 border-r w-full text-xs
      "
      >
        Satellite Information
      </h2>

      <ul class=" border-white/50 space-y-2 pl-2 pr-10 py-2 w-fit relative">
        {#each satelliteData as satellite}
          <li>
            <strong class="bg-[#FA8322]/90 p-[2px] text-xs"
              >{satellite.name}:</strong
            >
            {satellite.position}, {satellite.status}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <section class="">
    <!-- <div class="relative top-10">
      <h2
        class="w-fit uppercase grid ml-2 text-xs
      "
      >
        Satellite Information
      </h2>

      <ul
        class=" border-[#F5D546]/50 pl-2 pr-10 py-2 rounded-xl border-r border-t border-b w-fit relative"
      >
        {#each satelliteData as satellite}
          <li>
            <strong>{satellite.name}:</strong>
            {satellite.position}, {satellite.status}
          </li>
        {/each}
      </ul>
    </div> -->

    {#if displayHome}
      <!-- Render the Home component when displayHome is true -->
      <Home />
    {/if}

    {#if displayIndex}
      <!-- Render the index.svelte component when displayIndex is true -->
      <!-- Add code for the index component here -->
      <VChart />
    {/if}

    <!-- Add code for the satellite information here -->
  </section>
</main>
