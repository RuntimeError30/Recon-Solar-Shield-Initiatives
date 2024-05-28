<script>
    let magneticReconnectionFrequencyDay = 0.1;
    let magneticReconnectionFrequencyMonth = 0.15;
    let magneticReconnectionFrequencyYear = 0.12;
  </script>
  
  <main>
    <section>
      <h4 class="bullet-point">
        Reconnection Rate Over The Day: {magneticReconnectionFrequencyDay}
      </h4>
      <h4 class="bullet-point">
        Reconnection Rate Over The Month: {magneticReconnectionFrequencyMonth}
      </h4>
      <h4 class="bullet-point">
        Reconnection Rate Over The Year: {magneticReconnectionFrequencyYear}
      </h4>
      <div class="options-container">
        <button class="round-button">bx</button>
        <button class="round-button">by</button>
        <button class="round-button">bz</button>
        <button class="round-button">bt</button>
        <button class="round-button">vt</button>
      </div>
    </section>
  </main>
  
  <style>
    .options-container {
      display: flex;
      margin-top: 10px;
    }
  
    .round-button {
      width: 40px;
      height: 40px;
      border: 2px solid yellow;
      border-radius: 50%;
      margin-right: 10px;
      color: white;
      margin-left: 5px;
      cursor: pointer;
      transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
  
    .round-button:hover {
      box-shadow: 0 0 20px yellow; /* Adjust the glow effect */
      transform: scale(1.1); /* Adjust the scale effect */
    }
  
    .bullet-point {
      position: relative;
      padding-left: 20px;
    }
  
    .bullet-point::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      animation: glow 1s infinite;
    }
  
    @keyframes glow {
      0% {
        box-shadow: 0 0 5px red;
      }
      50% {
        box-shadow: 0 0 20px red;
      }
      100% {
        box-shadow: 0 0 5px red;
      }
    }
  </style>
  
