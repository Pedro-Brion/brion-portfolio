<script setup>
import { toggleDark } from "@/lib/transition";
</script>

<template>
  <nav class="navbar">
    <div class="icon">
      <a href="https://github.com/Pedro-Brion" target="_blank" title="GitHub">
        <div class="i-carbon-logo-github"></div>
      </a>
    </div>
    <div class="icon" @click="toggleDark" title="Dark Mode">
      <div class="i-carbon-sun dark:i-carbon-moon"></div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import "../theme/variables";

.navbar {
  width: 50px;
  border-right: 1px solid $primaryDark;
  display: flex;
  height: calc(100vh - 50px);
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
}
.icon {
  padding: 5px;
  border-radius: 99px;
  cursor: pointer;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  transition: background-color 400ms ease-in-out;

  &:hover {
    background-color: #00000020;
  }

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
