<template>
  <div class="grid-container">
    <div>
      <DifficultyControls @difficulty-selected="resetGame" />
      <div class="timer">
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
          pointerEvents: block ? 'none' : 'auto',
        }"
      >
        <Tile
          v-for="(tile, index) in tileArray"
          :key="index"
          :row="Math.floor(index / size) + 1"
          :col="(index % size) + 1"
          :tileSize="tileSize"
          :type="String(types[index])"
          @tile-guessed="handleTileGuessed"
          @tile-clicked="handleTileClicked"
          @block-click="handleBlockClick"
        />
      </div>
      <div class="click-count">Clicks: {{ clickCount }}</div>
    </div>
  </div>
</template>

<script>
import { useStopwatch } from "vue-timer-hook";
import Tile from "./Tile.vue";
import DifficultyControls from "./DifficultyControls.vue";
import { getNDuplicatedElements } from "@/utils/tilesHelpers.js";

export default {
  components: { Tile, DifficultyControls },
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
    this.loadHistory();
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
    loadHistory() {
      this.history = JSON.parse(localStorage.getItem("history") || "[]");
    },
    saveHistory() {
      localStorage.setItem("history", JSON.stringify(this.history));
    },
    handleTileClicked() {
      this.clickCount++;
    },
    handleTileGuessed() {
      this.guessedCount += 2;
      if (this.guessedCount === this.size * this.size) {
        this.handleWin();
      }
    },
    handleWin() {
      setTimeout(() => {
        this.history.push({
          duration: `${this.stopwatch.days}:${this.stopwatch.hours}:${this.stopwatch.minutes}:${this.stopwatch.seconds}`,
          clickCount: this.clickCount,
        });
        this.saveHistory();
        this.winAudio.play();
        alert("You won!");
        this.resetGame(this.size);
      }, 100);
    },
    handleBlockClick() {
      this.block = true;
      setTimeout(() => {
        this.block = false;
      }, 1000);
    },
    handleDifficultyClick(size) {
      this.resetGame(size);
    },
    resetGame(size) {
      this.startAudio.play();
      this.size = size;
      this.types = getNDuplicatedElements((size * size) / 2);
      this.gameNumber++;
      this.stopwatch.reset();
      this.clickCount = 0;
      this.guessedCount = 0;
      this.block = false;
    },
  },
};
</script>

<style scoped>
.grid-container {
  display: flex;
  justify-content: center;
  height: calc(100vh - 50px);
  background-image: linear-gradient(white, #697272);
  padding: 50px 10px 0 10px;
}

.timer {
  margin: 16px 0;
  text-align: center;
  font-size: 1.2em;
  font-family: "Audiowide", sans-serif;
}

.canvas-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
}

.click-count {
  margin-top: 16px;
  text-align: center;
}
</style>
