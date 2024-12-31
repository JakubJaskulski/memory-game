<template>
  <canvas
    :width="tileSize"
    :height="tileSize"
    class="tile-canvas"
    ref="tileCanvas"
    @mousemove="handleMouseMove"
    @mouseleave="resetParallax"
    @click="handleClick"
  ></canvas>
</template>

<script>
import { ref } from "vue";
import tilesData from "./tiles.json";

const lastFlippedTile = ref(null);

export function setLastFlippedTile(tile) {
  lastFlippedTile.value = tile;
}

export default {
  props: {
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    tileSize: { type: Number, default: 100 },
    type: { type: String, required: true },
  },
  data() {
    return {
      flipped: false,
      guessed: false,
      parallaxOffset: { x: 0, y: 0 },
      img: null,
      clickAudio: new Audio("/audio/shot.mp3"),
      guessAudio: new Audio("/audio/headshot.mp3"),
    };
  },
  mounted() {
    this.loadImage();
    this.drawTile();
  },
  methods: {
    loadImage() {
      const tileData = tilesData[this.type];
      this.img = new Image();
      this.img.src = tileData.path;
      this.img.onload = this.drawTile;
    },
    drawTile() {
      const canvas = this.$refs.tileCanvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, this.tileSize, this.tileSize);

      const offset = {
        x: this.parallaxOffset.x * 0.1,
        y: this.parallaxOffset.y * 0.1,
      };

      this.drawBackground(ctx, offset);
      if (this.flipped && this.img) {
        this.drawImage(ctx, offset);
      }

      this.drawBorder(ctx);
    },
    drawBackground(ctx, offset) {
      const tileData = tilesData[this.type];
      const gradient = ctx.createLinearGradient(
        offset.x,
        offset.y,
        this.tileSize + offset.x,
        this.tileSize + offset.y
      );

      if (this.flipped) {
        gradient.addColorStop(0, tileData.background);
        gradient.addColorStop(1, "black");
      } else {
        gradient.addColorStop(0, "grey");
        gradient.addColorStop(1, "black");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.tileSize, this.tileSize);
    },
    drawImage(ctx, offset) {
      ctx.drawImage(
        this.img,
        5 + offset.x,
        5 + offset.y,
        this.tileSize - 10,
        this.tileSize - 10
      );
    },
    drawBorder(ctx) {
      ctx.strokeStyle = "#000";
      ctx.strokeRect(0, 0, this.tileSize, this.tileSize);
    },
    handleClick() {
      if (this.flipped || this.guessed) return;

      this.flipped = true;
      this.clickAudio.play();
      this.drawTile();

      if (!lastFlippedTile.value) {
        setLastFlippedTile(this);
        return;
      }

      if (lastFlippedTile.value.type === this.type) {
        this.handleMatch();
      } else {
        this.handleMismatch();
      }
    },
    handleMatch() {
      this.guessed = true;
      lastFlippedTile.value.guessed = true;
      setLastFlippedTile(null);

      this.guessAudio.play();
      this.$emit("tile-guessed");
    },
    handleMismatch() {
      this.$emit("block-click");

      setTimeout(() => {
        this.resetTileState();
        lastFlippedTile.value.resetTileState();
        setLastFlippedTile(null);
      }, 1000);
    },
    resetTileState() {
      this.flipped = false;
      this.drawTile();
    },
    handleMouseMove(event) {
      const rect = this.$refs.tileCanvas.getBoundingClientRect();
      this.parallaxOffset.x = event.clientX - rect.left - this.tileSize / 2;
      this.parallaxOffset.y = event.clientY - rect.top - this.tileSize / 2;
      this.drawTile();
    },
    resetParallax() {
      this.parallaxOffset = { x: 0, y: 0 };
      this.drawTile();
    },
  },
};
</script>

<style scoped>
.tile-canvas {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.tile-canvas:hover {
  transform: scale(1.05);
}
</style>
