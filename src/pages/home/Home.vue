<script setup>
import { Scene } from "three";
import { computed, onMounted, ref, watch } from "vue";
import { Experience } from "@/lib/threejs";
import { Colors } from "@/theme/Colors";
import { useDark } from "@vueuse/core";

const canvas = ref(null);
const experience = ref(null);

const isDark = useDark();

watch(isDark, () => {
  const value = isDark.value ? "dark" : "light";
  if (experience.value) experience.value.changeTheme(value);
});

onMounted(() => {
  experience.value = new Experience(
    canvas.value,
    isDark.value ? "dark" : "light"
  );
});
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div class="home-page">
    <div class="text">
      <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est odit sunt dignissimos vero sed. Delectus beatae voluptas minima, velit ipsa sequi tempora placeat alias, laboriosam enim nostrum, illum perferendis facere?</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../theme/variables.scss";

canvas {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
}

.home-page {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding:20px;

  .text{
    width: 100%;
    max-width: 250px;
    text-align: end;
    font-size: 1.5rem;
  }
}
</style>
