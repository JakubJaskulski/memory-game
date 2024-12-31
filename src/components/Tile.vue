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
export function setLastFlippedTile(tile) {
  lastFlippedType.value = tile;
}

export default {
  data() {
    return {
      flipped: false,
      guessed: false,
      parallaxOffsetX: 0,
      parallaxOffsetY: 0,
      img: null,
      clickAudio: new Audio("/audio/shot.mp3"),
      guessAudio: new Audio("/audio/headshot.mp3"),
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
    this.loadImage();
    this.drawTile();
    setLastFlippedTile(null);
  },
  methods: {
    loadImage() {
      const tileData = tilesData[this.type];
      this.img = new Image();
      this.img.src = tileData.path;
      this.img.onload = () => {
        this.drawTile();
      };
    },
    drawTile() {
      const tileData = tilesData[this.type];
      const canvas = this.$refs.tileCanvas;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, this.tileSize, this.tileSize);

      const offsetX = this.parallaxOffsetX * 0.1;
      const offsetY = this.parallaxOffsetY * 0.1;

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

        if (this.img) {
          ctx.drawImage(this.img, 5 + offsetX, 5 + offsetY, 90, 90);
        }
      } else {
        const gradient = ctx.createLinearGradient(
          offsetX,
          offsetY,
          this.tileSize + offsetX,
          this.tileSize + offsetY
        );
        gradient.addColorStop(0, "grey");
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);
      }

      ctx.strokeStyle = "#000";
      ctx.strokeRect(0, 0, this.tileSize, this.tileSize);
    },
    handleClick() {
      if (this.flipped || this.guessed) {
        return;
      }

      this.$emit("tile-clicked");

      this.clickAudio.play();
      this.flipped = true;
      this.drawTile();

      if (!lastFlippedType.value) {
        setLastFlippedTile(this);
        return;
      }

      if (lastFlippedType.value.type === this.type) {
        this.guessed = true;
        setLastFlippedTile(null);

        this.guessAudio.play();

        this.$emit("tile-guessed");
        return;
      }

      this.$emit("block-click");

      setTimeout(() => {
        this.flipped = false;
        this.drawTile();

        lastFlippedType.value.flipped = false;
        lastFlippedType.value.drawTile();
        setLastFlippedTile(null);
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
