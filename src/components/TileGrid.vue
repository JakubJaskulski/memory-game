<template>
  <div class="grid-container">
    <div>
      <div class="controls">
        <label>Difficulty</label>
        <button
          class="difficulty-button"
          @click="() => handleDifficultyClick(2)"
        >
          Easy
        </button>
        <button
          class="difficulty-button"
          @click="() => handleDifficultyClick(4)"
        >
          Medium
        </button>
        <button
          class="difficulty-button"
          @click="() => handleDifficultyClick(6)"
        >
          Hard
        </button>
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
        />
      </div>
      <div>Clicks: {{ this.clickCount }}</div>
    </div>
  </div>
</template>

<script>
import { useStopwatch } from "vue-timer-hook";

import Tile from "./Tile.vue";
import { getNDuplicatedElements } from "@/utils/tilesHelpers.js";

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
      startAudio: new Audio("/audio/start.mp3"),
      winAudio: new Audio("/audio/win.mp3"),
      history: [],
    };
  },
  created() {
    this.history = JSON.parse(localStorage.getItem("history") || "[]");
  },
  computed: {
    gridWidth() {
      return this.size * (this.tileSize + 10);
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
        //handle win
        setTimeout(() => {
          this.history.push({
            duration: `${this.stopwatch.days}:${this.stopwatch.hours}:${this.stopwatch.minutes}:${this.stopwatch.seconds}`,
            clickCount: this.clickCount,
          });
          localStorage.setItem("history", JSON.stringify(this.history));

          this.winAudio.play();
          alert(`You won!`);
          this.handleDifficultyClick(this.size);
        }, 100);
      }
    },
    handleBlockClick() {
      this.block = true;

      setTimeout(() => {
        this.block = false;
      }, 1000);
    },
    handleDifficultyClick(size) {
      this.startAudio.play();

      this.guessedCount = 0;
      this.size = size;
      this.types = getNDuplicatedElements((size * size) / 2);
      this.gameNumber++;
      this.stopwatch.reset();
      this.clickCount = 0;
      this.block = false;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");

.grid-container {
  display: flex;
  justify-content: center;
  height: calc(100vh - 50px);
  background-image: linear-gradient(white, #697272);
  padding: 50px 10px 0 10px;
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
  gap: 10px;
  margin: 0 auto;
}

.controls {
  margin-bottom: 16px;
  text-align: center;
}

.difficulty-button {
  background-color: #2a2d2d;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: "Audiowide", sans-serif;
}

.difficulty-button:hover {
  background-color: #424640;
  transform: translateY(-2px);
}

.difficulty-button:active {
  background-color: #5a6c5b;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
