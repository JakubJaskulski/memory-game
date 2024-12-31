<template>
  <div class="app">
    <TileGrid />
  </div>
</template>

<script>
import TileGrid from "./components/TileGrid.vue";

export default {
  components: { TileGrid },
};
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #252528;
  color: #181818;
}
</style>
