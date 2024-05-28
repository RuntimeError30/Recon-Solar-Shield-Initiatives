<script>
  import { onMount } from "svelte";

  const apiKey = "1202a311-b72c-4c0c-87fb-48cd908723c1";
  const baseApiUrl = "https://app-rssi-api-eastus-dev-001.azurewebsites.net";
  // const baseApiUrl = "https://localhost:7095";
  const earthApiUrl = baseApiUrl + "/api/earthdata/ncei";
  const solarWindApiUrl = baseApiUrl + "/api/satellitedata/ace";
  const predUrl = baseApiUrl + "/api/btregression";

  let earthData = {};
  let solarWindData = {};
  let solarWindPred = {};
  let data = {};

  let reconFreqDay;
  let reconFreqMonth;
  let reconFreqWeek;

  let vector = {
    bt_pred: 0,
    bx_pred: 0,
    by_pred: 0,
    bz_pred: 0,
  };

  // Function to fetch Earth data
  async function fetchEarthData() {
    console.log("Fetching geo-magnetic data");
    const response = await fetch(earthApiUrl, {
      headers: {
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      earthData = await response.json();
    } else {
      console.error("Failed to fetch geomagnetic data!");
    }
  }

  // Function to fetch solar wind data
  async function fetchSolarWindData() {
    console.log("Fetching solar wind data");
    const response = await fetch(solarWindApiUrl, {
      headers: {
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      solarWindData = await response.json();
    } else {
      console.error("Failed to fetch solae wind data!");
    }
  }

  // Function to fetch solar wind data
  async function fetchSolarWindPrediction(wind, earth) {
    var date = new Date();

    const requestBody = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      bxGSM: wind.bxGSM,
      byGSM: wind.byGSM,
      bzGSM: wind.bzGSM,
      intensity: earth.intensity,
      declination: earth.declination,
      inclination: earth.inclination,
      east: earth.east,
      north: earth.north,
      vertical: earth.vertical,
      horizontal: earth.horizontal,
      class: 2 /*Class labeled as positive*/,
    };
    console.log("Fetching solar wind predictions");

    const response = await fetch(predUrl, {
      method: "POST",
      headers: {
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      solarWindPred = await response.json();
    } else {
      console.error("Failed to fetch prediction!");
    }
  }

  onMount(async () => {
    // Fetch data from backend
    await fetchSolarWindData();
    await fetchEarthData();

    if (solarWindData != null && earthData != null) {
      await fetchSolarWindPrediction(solarWindData, earthData);
    }
    vector.bt_pred = solarWindPred.bt;

    data = await fetchDscovrData();

    vector.bx_pred =
      vector.bt_pred * Math.cos(data.theta_gsm) * Math.cos(data.phi_gsm);
    vector.by_pred =
      vector.bt_pred * Math.cos(data.theta_gsm) * Math.sin(data.phi_gsm);
    vector.bz_pred = vector.bt_pred * Math.sin(data.theta_gsm);
  });

  async function fetchDscovrData() {
    let url = "https://services.swpc.noaa.gov/json/dscovr/dscovr_mag_1s.json";

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Successfully posted the tweet
        const data = await response.json();
        const lastElement = data[data.length - 1];
        return lastElement;
      } else {
        // Handle any errors during the POST request
        console.error("Failed to fetch data!");
      }
    } catch (error) {
      // Handle network or fetch errors
      console.error("Error :", error);
    }
  }
</script>

<main>
  <section class="flex items-start mt-5 w-full justify-between space-x-5">
    <div class="w-full">
      <div class="flex items-start w-full">
        <div>
          <h1
            style="font-family: 'Jura', sans-serif; writing-mode: vertical-rl;"
            class="uppercase text-xs text-sideways"
          >
            section 001
          </h1>
        </div>

        <div
          class=" p-[1px] w-full"
          style="background: linear-gradient( -135deg, transparent 20px, #ffffff4d 0);"
        >
          <div
            class=" p-3 w-full space-y-3"
            style="background: linear-gradient( -135deg, transparent 20px, #161E1C 0);"
          >
            <h3
              class="flex bg-[#132e27] w-fit p-2 rounded-md items-center text-sm uppercase space-x-2 tracking-wide border border-[#1df2f0]"
              style=" box-shadow: 0px 5px 10px -5px rgb(0, 255, 213);"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              Reconnection freq
            </h3>

            <h4 class=" bullet-point">
              Over The Day: {reconFreqDay}
            </h4>
            <h4 class="bullet-point">
              Over The Week: {reconFreqWeek}
            </h4>
            <h4 class="bullet-point">
              Over The Month: {reconFreqMonth}
            </h4>
          </div>
        </div>
      </div>
      <h1
        class="title text-xl ml-4 border border-[#b3c7c2]/20 shadow-xl bg-[#132e27] w-fit p-2 mt-2 uppercase"
      >
        AI assisted analytics
      </h1>
    </div>

    <div class="w-full">
      <div class="flex">
        <h1
          style="font-family: 'Jura', sans-serif; writing-mode: vertical-rl;"
          class="uppercase text-xs text-sideways"
        >
          section 002
        </h1>
        <div
          class="w-full p-[1px]"
          style="background: linear-gradient( -135deg, transparent 20px, #ffffff4d 0);"
        >
          <div
            class="grid w-full p-7"
            style="background: linear-gradient( -135deg, transparent 20px, #161E1C 0);"
          >
            {#if !vector.bt_pred}
              <p class="text-sm">Fetching...</p>
            {/if}

            <div class="space-x-5 flex">
              <button class="  w-full p-[1px]">
                <h1 class="text-xs flex justify-start px-5">Bx</h1>
                <h1 class="text-xl relative -top-2">
                  {vector.bx_pred.toFixed(2)}
                </h1>
              </button>
              <button class="  w-full">
                <h1 class="text-xs flex justify-start px-5">By</h1>
                <h1 class="text-xl relative -top-2">
                  {vector.by_pred.toFixed(2)}
                </h1>
              </button>
              <button class="  w-full">
                <h1 class="text-xs flex justify-start px-5">Bz</h1>
                <h1 class="text-xl relative -top-2">
                  {vector.bz_pred.toFixed(2)}
                </h1>
              </button>
              <button class="  w-full">
                <h1 class="text-xs flex justify-start px-5">Bt</h1>
                <h1 class="text-xl relative -top-2">
                  {vector.bt_pred.toFixed(2)}
                </h1>
              </button>
            </div>
            <p class="relative top-5 text-xs">
              Powered by <a
                href="https://dotnet.microsoft.com/en-us/apps/machinelearning-ai"
                target="_blank"
              >
                ML.NET
              </a>
            </p>
          </div>
        </div>
      </div>
      <h1
        class="title text-xl ml-4 border border-[#b3c7c2]/20 shadow-xl bg-[#132e27] w-fit p-2 mt-2 uppercase"
      >
        Most vulnerable conditions
      </h1>
    </div>
  </section>
</main>

<style>
  .bullet-point {
    position: relative;
    padding-left: 20px;
  }

  .bullet-point::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #fa8322;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    animation: glow 1s infinite;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px #fa8322;
    }
    50% {
      box-shadow: 0 0 20px #fa8322;
    }
    100% {
      box-shadow: 0 0 5px #fa8322;
    }
  }

  a {
    color: dodgerblue;
    text-decoration: none;
    font-weight: bold;
  }

  /* Button code */
  button,
  button::after {
    font-size: 20px;
    border: none;
    border-radius: 5px;
    color: white;
    background-color: transparent;
    position: relative;
    background-color: transparent;
    border: 1px solid rgb(0, 255, 213);
    box-shadow: 0px 5px 10px -5px rgb(0, 255, 213);
    background-color: #132e27;
  }

  button:hover::after {
    text-shadow: black;

    text-shadow: #1df2f0, #e94be8;
    background-color: transparent;
    border: 3px solid rgb(0, 255, 213);
  }

  button:hover {
    text-shadow:
      -1px -1px 0px #1df2f0,
      1px 1px 0px #e94be8;
  }

  /* title */
</style>
