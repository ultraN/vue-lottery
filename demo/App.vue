<template>
  <div id="app">
    <general-usage/>
  </div>
</template>
<script>
import GeneralUsage from "./GeneralUsage";
export default {
  name: "demo",
  components: {
    GeneralUsage
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 40px;
}
</style>
