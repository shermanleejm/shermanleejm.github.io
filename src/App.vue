<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/A">Screen A</router-link> |
    <router-link to="/B">Screen B</router-link>
  </div>
  <router-view />

  <iframe
    src="https://docs.google.com/forms/d/e/1FAIpQLSeUoMM8yLnRkvl4TFFmQoIdfLhc1yH_X5rRBi4XIvexHudVzQ/viewform?embedded=true"
    width="400px"
    height="700px"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    >Loading…</iframe
  >
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#nav {
  margin: auto;
  text-align: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
