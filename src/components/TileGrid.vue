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
          @unblock-click="handleUnblockClick"
        />
      </div>
      <div>Clicks: {{ this.clickCount }}</div>
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
      startAudio: new Audio("public/audio/start.mp3"),
      winAudio: new Audio("public/audio/win.mp3"),
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
    getHistory() {
      return localStorage.getItem("history");
    },
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
    },
    handleUnblockClick() {
      this.block = false;
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
  padding-top: 50px;
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
  background-color: #2a2d2d; /* Green background */
  color: white; /* White text */
  border: none; /* No border */
  border-radius: 12px; /* Rounded corners */
  padding: 10px 20px; /* Padding for size */
  margin: 0 5px; /* Spacing between buttons */
  font-size: 16px; /* Adjust text size */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Add shadow */
  transition: all 0.3s ease; /* Smooth transition */
  font-family: "Audiowide";
}

.difficulty-button:hover {
  background-color: #424640; /* Darker green on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

.difficulty-button:active {
  background-color: #5a6c5b; /* Even darker green on click */
  transform: translateY(0); /* Reset lift */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Adjust shadow */
}
</style>
