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

const lastFlippedType = ref(0);
function setLastFlippedTile(tile) {
  lastFlippedType.value = tile;
}

export default {
  data() {
    return {
      flipped: false,
      guessed: false,
      parallaxOffsetX: 0,
      parallaxOffsetY: 0,
      clickAudio: new Audio("public/audio/shot.mp3"),
      guessAudio: new Audio("public/audio/headshot.mp3"),
    };
  },
  props: {
    row: {
      type: Number,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    tileSize: {
      type: Number,
      default: 100,
    },
    type: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.drawTile();
  },
  methods: {
    drawTile() {
      const tileData = tilesData[this.type];
      const canvas = this.$refs.tileCanvas;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, this.tileSize, this.tileSize);

      // Calculate parallax offsets
      const offsetX = this.parallaxOffsetX * 0.1; // Adjust parallax strength
      const offsetY = this.parallaxOffsetY * 0.1;

      // Draw tile background
      if (this.flipped) {
        const gradient = ctx.createLinearGradient(
          offsetX,
          offsetY,
          this.tileSize + offsetX,
          this.tileSize + offsetY
        );
        gradient.addColorStop(0, tileData.background);
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        const img = new Image();
        img.onload = () => {
          // Draw the image with a parallax effect
          ctx.drawImage(img, 5 + offsetX, 5 + offsetY, 90, 90);
        };
        img.src = tileData.path;
      } else {
        ctx.fillStyle = "#2196f3";
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);
      }

      // Draw tile border
      ctx.strokeStyle = "#000";
      ctx.strokeRect(0, 0, this.tileSize, this.tileSize);

      // Draw tile text
      ctx.fillStyle = "#0f1010";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${this.type}`, this.tileSize / 2, this.tileSize / 2);
    },
    handleClick() {
      if (this.flipped || this.guessed) {
        return;
      }

      this.$emit("tile-clicked", {
        row: this.row,
        col: this.col,
      });

      this.clickAudio.play();

      if (!lastFlippedType.value) {
        this.flipped = true;
        setLastFlippedTile(this);
        this.drawTile();
        return;
      }

      this.flipped = true;
      this.drawTile();

      if (lastFlippedType.value.type === this.type) {
        this.guessed = true;
        setLastFlippedTile(null);

        this.guessAudio.play();

        this.$emit("tile-guessed", {
          row: this.row,
          col: this.col,
        });

        return;
      }

      this.$emit("block-click");

      setTimeout(() => {
        this.flipped = false;
        this.drawTile();

        lastFlippedType.value.flipped = false;
        lastFlippedType.value.drawTile();
        setLastFlippedTile(null);

        this.$emit("unblock-click");
      }, 1000);
    },
    handleMouseMove(event) {
      const rect = this.$refs.tileCanvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      this.parallaxOffsetX = mouseX - this.tileSize / 2;
      this.parallaxOffsetY = mouseY - this.tileSize / 2;

      this.drawTile();
    },
    resetParallax() {
      this.parallaxOffsetX = 0;
      this.parallaxOffsetY = 0;
      this.drawTile();
    },
  },
};
</script>

<style>
.tile-canvas {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
