<script setup>
import { Scene } from "three";
import { computed, onMounted, ref, watch } from "vue";
import { Experience } from "@/lib/threejs";
import { Colors } from "@/theme/Colors";
import { useDark } from "@vueuse/core";

const canvas = ref(null);
const experience = ref(null);

const info = ref(null);

const isDark = useDark();

watch(isDark, () => {
  const value = isDark.value ? "dark" : "light";
  if (experience.value) experience.value.changeTheme(value);
});

onMounted(() => {
  experience.value = new Experience(
    canvas.value,
    isDark.value ? "dark" : "light",
    info.value
  );
});
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div ref="info"></div>
  <div class="pages">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
canvas {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: -1;
}

.pages {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;
}
</style>
