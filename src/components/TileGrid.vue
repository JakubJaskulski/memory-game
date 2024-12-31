<template>
  <div class="grid-container">
    <div>
      <div class="controls">
        <label>Difficulty</label>
        <button @click="() => handleDifficultyClick(2)">Easy</button>
        <button @click="() => handleDifficultyClick(4)">Medium</button>
        <button @click="() => handleDifficultyClick(6)">Hard</button>
      </div>

      <div>
        <span>{{ stopwatch.days }}</span
        >:<span>{{ stopwatch.hours }}</span
        >:<span>{{ stopwatch.minutes }}</span
        >:<span>{{ stopwatch.seconds }}</span>
      </div>

      <div
        class="canvas-grid"
        :key="gameNumber"
        :style="{
          width: gridWidth + 'px',
          pointerEvents: this.block ? 'none' : 'auto',
        }"
      >
        <Tile
          v-for="(tile, index) in tileArray"
          :key="index"
          :row="Math.floor(index / size) + 1"
          :col="(index % size) + 1"
          :tileSize="tileSize"
          :type="String(this.types[index])"
          @tile-guessed="handleTileGuessed"
          @tile-clicked="handleTileClicked"
          @block-click="handleBlockClick"
          @unblock-click="handleUnblockClick"
        />
      </div>
      <div>Clicks: {{ this.clickCount }}</div>
      <div>---debug---</div>
      <div>Game number: {{ this.gameNumber }}</div>
      <div>Game size: {{ this.size }}</div>
    </div>
  </div>
</template>

<script>
import { useStopwatch } from "vue-timer-hook";

const tileTypes = Array.from({ length: 18 }, (_, index) => index + 1);
const getNDuplicatedElements = (n) => {
  const types = tileTypes.slice(0, n);

  const duplicatedTypes = types.reduce(
    (acc, element) => acc.concat([element, element]),
    []
  );

  return duplicatedTypes.sort(() => 0.5 - Math.random());
};

import Tile from "./Tile.vue";

export default {
  components: { Tile },
  data() {
    return {
      size: 4,
      tileSize: 100,
      gameNumber: 1,
      types: getNDuplicatedElements(8),
      guessedCount: 0,
      stopwatch: useStopwatch(true),
      clickCount: 0,
      block: false,
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
    handleTileClicked() {
      this.clickCount++;
    },
    handleTileGuessed() {
      this.guessedCount += 2;
      if (this.guessedCount === this.size * this.size) {
        setTimeout(() => {
          alert(`You won!`);
          this.handleDifficultyClick(this.size);
        }, 100);
      }
    },
    handleBlockClick() {
      this.block = true;
    },
    handleUnblockClick() {
      this.block = false;
    },
    handleDifficultyClick(size) {
      this.guessedCount = 0;
      this.size = size;
      this.types = getNDuplicatedElements((size * size) / 2);
      this.gameNumber++;
      this.stopwatch.reset();
      this.clickCount = 0;
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
