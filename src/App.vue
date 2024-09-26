<script setup>
import { useDebug } from "./composables/useDebug";

const { debugMode } = useDebug();
</script>

<template>
  <NavBar v-if="!debugMode" />
  <div class="content">
    <SideBar v-if="!debugMode" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  height: calc(100dvh - 51px);
  overflow: hidden;
}
main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
