<template>
  <div class="grid-container">
    <div>
      <div class="controls">
        <label>Difficulty</label>
        <button @click="() => handleDifficultyClick(2)">Easy</button>
        <button @click="() => handleDifficultyClick(4)">Medium</button>
        <button @click="() => handleDifficultyClick(6)">Hard</button>
      </div>

      <div class="canvas-grid" :style="{ width: gridWidth + 'px' }">
        <Tile
          v-for="(tile, index) in tileArray"
          :key="index"
          :row="Math.floor(index / size) + 1"
          :col="(index % size) + 1"
          :tileSize="tileSize"
          @tile-clicked="handleTileClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tile from "./Tile.vue";

export default {
  components: { Tile },
  data() {
    return {
      size: 5,
      tileSize: 60,
      lastFlippedType: null,
    };
  },
  computed: {
    gridWidth() {
      return this.size * this.tileSize;
    },
    tileArray() {
      return Array.from({ length: this.size * this.size });
    },
  },
  methods: {
    handleTileClick(tile) {
      //check if game finished
      alert(
        `Tile clicked: Row ${tile.row}, Column ${tile.col}, flipped ${tile.flipped}, guessed ${tile.guessed}`
      );
    },
    handleDifficultyClick(size) {
      this.size = size;
    },
  },
};
</script>

<style>
.grid-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.controls {
  margin-bottom: 16px;
  text-align: center;
}

label {
  margin-right: 12px;
}

.canvas-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
