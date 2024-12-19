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
  min-height: 100vh;
  background-color: #f5f5f5;
  min-width: 500px;
}
</style>
