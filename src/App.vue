<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/A">Screen A</router-link> |
    <router-link to="/B">Screen B</router-link>
  </div>
  <router-view />
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
