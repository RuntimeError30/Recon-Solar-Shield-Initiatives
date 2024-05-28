<!-- src/routes/app.svelte -->

<script>
  import { Router, Route } from "svelte-routing";
  import Index from "./routes/index.svelte";
  import Home from "./routes/home.svelte";
  import VChart from "./routes/v_chart.svelte";
  import Analytics from "./routes/analytics.svelte";
</script>

<main>
  <Router>
    <Route path="/" component={Index} />
    <Route path="/home" component={Home} />
    <Route path="/chart" component={VChart} />
    <Route path="/analytics" component={Analytics} />
  </Router>
</main>
