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
      default: 60,
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
      const canvas = this.$refs.tileCanvas;
      const ctx = canvas.getContext("2d");

      // Draw tile background
      if (this.flipped) {
        ctx.fillStyle = "#3df321";
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);
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

      if (!lastFlippedType.value) {
        this.flipped = true;
        setLastFlippedTile(this);
        this.drawTile();
        return;
      }

      if (lastFlippedType.value.type === this.type) {
        this.flipped = true;
        this.guessed = true;
        this.drawTile();
        setLastFlippedTile(null);

        this.$emit("tile-guessed", {
          row: this.row,
          col: this.col,
          flipped: this.flipped,
          guessed: this.guessed,
        });

        return;
      }

      this.flipped = false;
      this.drawTile();

      lastFlippedType.value.flipped = false;
      lastFlippedType.value.drawTile();
      setLastFlippedTile(null);

      this.$emit("tile-clicked", {
        row: this.row,
        col: this.col,
        flipped: this.flipped,
        guessed: this.guessed,
      });
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
