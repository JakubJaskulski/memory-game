<template>
  <canvas
    :width="tileSize"
    :height="tileSize"
    class="tile-canvas"
    ref="tileCanvas"
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

      // Draw tile background
      if (this.flipped) {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          this.tileSize,
          this.tileSize
        );
        gradient.addColorStop(0, tileData.background); // Start color
        gradient.addColorStop(1, "black"); // End color

        // Apply the gradient as the fill style and fill the canvas
        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        const img = new Image();
        img.onload = () => {
          // Draw the image onto the canvas
          ctx.drawImage(img, 5, 5, 90, 90);
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
  },
};
</script>

<style>
.tile-canvas {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
