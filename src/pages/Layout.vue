<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Experience } from "@/lib/threejs";
import { useDark } from "@vueuse/core";
import { useDebug } from "@/composables/useDebug";

const canvas = ref<HTMLElement | null>(null);
const experience = ref<Experience | null>(null);

const info = ref<HTMLElement | null>(null);

const isDark = useDark();

const { debugVisibility, debugMode, toggleDebug } = useDebug();

watch(isDark, () => {
  const value = isDark.value ? "dark" : "light";
  if (experience.value) experience.value.changeTheme(value);
});

watch(debugMode, () => {
  if (experience.value) experience.value.toggleDebug(debugMode.value);
});

onMounted(() => {
  experience.value = new Experience(
    canvas.value!,
    isDark.value ? "dark" : "light",
    info.value!
  );
});
</script>

<template>
  <canvas ref="canvas" :class="[debugMode && 'debug']"></canvas>
  <!-- <div ref="info"></div> -->
  <button
    v-if="debugVisibility"
    class="debug-button cursor-pointer"
    @click="toggleDebug">
    <div class="icon">
      <div class="i-carbon-tools"></div>
    </div>
  </button>
  <RouterView v-if="!debugMode" />
</template>

<style lang="scss" scoped>
canvas {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: -1;
  &.debug {
    z-index: 1;
  }
}

.debug-button {
  height: 20px;
  width: 20px;
  position: absolute;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: pink;
  border: none;
  color: tomato;
  border-radius: 7px;
  z-index: 99;
  &:active {
    background-color: white;
  }
}
</style>
