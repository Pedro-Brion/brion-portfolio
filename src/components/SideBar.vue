<script setup lang="ts">
import { toggleDark } from "@/lib/transition";
</script>

<template>
  <aside class="navbar">
    <div class="icon">
      <a href="https://github.com/Pedro-Brion" target="_blank" title="GitHub">
        <div class="i-carbon-logo-github"></div>
      </a>
    </div>
    <div class="icon" @click="toggleDark" title="Dark Mode">
      <div class="i-carbon-sun dark:i-carbon-moon"></div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@import "../theme/variables";

.navbar {
  width: 50px;
  border-right: 1px solid $primaryDark;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
}
.icon {
  cursor: pointer;
  &:last-child {
    margin-bottom: 16px;
  }
}

.dark {
  .navbar {
    border-color: $primaryLight;
  }
}
</style>
