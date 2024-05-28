<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import Analytics from "./analytics.svelte";

  let magnetometerChart;
  let orientationChart;

  onMount(() => {
    const magnetometerCtx = magnetometerChart.getContext("2d");
    const orientationCtx = orientationChart.getContext("2d");

    // Data for the magnetometer chart
    const magnetometerData = {
      labels: ["June", "July", "Aug", "Sept", "Oct"],
      datasets: [
        {
          label: "Bt",
          data: [50, 55, 60, 65, 70],
          borderColor: "#94D2BD",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "ByGSM",
          data: [20, 25, 30, 35, 40],
          borderColor: "#EE9B00",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "BxGSM",
          data: [70, 75, 80, 85, 90],
          borderColor: "#FB3602",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "BzGSM",
          data: [30, 35, 40, 45, 50],
          borderColor: "#AF1724",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    // Data for the orientation chart (intensity, inclination, declination, north, east, vertical, horizontal)
    const orientationData = {
      labels: ["June", "July", "Aug", "Sept", "Oct"],
      datasets: [
        {
          label: "Intensity",
          data: [100, 110, 120, 130, 140],
          borderColor: "#015666",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Inclination",
          data: [10, 15, 20, 25, 30],
          borderColor: "#0A9396",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Declination",
          data: [-10, -15, -20, -25, -30],
          borderColor: "#94D2BD",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "North",
          data: [50, 55, 60, 65, 70],
          borderColor: "#EE9B00",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "East",
          data: [-20, -25, -30, -35, -40],
          borderColor: "#CA6702",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Vertical",
          data: [-30, -35, -40, -45, -50],
          borderColor: "#FB3602",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Horizontal",
          data: [70, 75, 80, 85, 90],
          borderColor: "#AF1724",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    // Adjust the chart height for larger charts
    const chartHeight = 600; // Set the desired height here

    const commonOptions = {
      maintainAspectRatio: true, // Enable aspect ratio
    };

    const magnetometerConfig = {
      type: "line",
      data: magnetometerData,
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Magnetometer Data",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    };

    const orientationConfig = {
      type: "line",
      data: orientationData,
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Orientation Data",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    };

    const resizeCharts = () => {
      magnetometerChart.height = chartHeight;
      orientationChart.height = chartHeight;
    };

    new Chart(magnetometerCtx, magnetometerConfig);
    new Chart(orientationCtx, orientationConfig);

    // Resize charts initially
    resizeCharts();
  });
</script>

<br />

<main class="">
  <div class="grid grid-cols-2 gap-x-10">
    <div class="border border-[#ffffff4d]/30">
      <canvas
        bind:this={magnetometerChart}
        id="magnetometerChart"
        style="box-shadow: 0px 8px 15px -10px rgb(0, 255, 213);"
      ></canvas>
    </div>
    <div class="border border-[#ffffff4d]/30">
      <canvas
        bind:this={orientationChart}
        id="orientationChart"
        class="border-b border-[#1df2f0]/70"
        style="box-shadow: 0px 8px 15px -10px rgb(0, 255, 213);"
      ></canvas>
    </div>
  </div>
  <div class="analytics"><Analytics /></div>
</main>

<style>
  .chart-items {
    width: 100%;
  }
</style>
