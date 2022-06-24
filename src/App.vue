<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/A">Screen A</router-link> |
    <router-link to="/B">Screen B</router-link>
  </div>

  <div id="content">
    <router-view />
    <hr />
    <div v-if="showForm">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeUoMM8yLnRkvl4TFFmQoIdfLhc1yH_X5rRBi4XIvexHudVzQ/viewform?embedded=true"
        width="auto"
        height="600px"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        >Loading…</iframe
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  computed: {
    showForm() {
      let currentRoute = this.$route.path;
      return currentRoute !== "/";
    },
  },
};
</script>

<style>
#nav {
  margin: auto;
  text-align: center;
}

#content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  margin-top: 60px;
}
</style>
