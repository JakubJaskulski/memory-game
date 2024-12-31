<template>
  <div class="controls">
    <label>Difficulty</label>
    <button
      v-for="(level, index) in levels"
      :key="index"
      class="difficulty-button"
      @click="selectDifficulty(level.size)"
    >
      {{ level.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      levels: [
        { label: "Easy", size: 2 },
        { label: "Medium", size: 4 },
        { label: "Hard", size: 6 },
      ],
    };
  },
  methods: {
    selectDifficulty(size) {
      this.$emit("difficulty-selected", size);
    },
  },
};
</script>

<style scoped>
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
