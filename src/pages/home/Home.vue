<script setup></script>

<template>
  <div class="home-page">
    <div class="text">
      <h2>Oi!</h2>
      <span ref="info">
        I’m <strong>Pedro Brion</strong>, a frontend developer from Brazil with a passion for creating engaging web experiences. I specialize in JavaScript, TypeScript, and various frameworks, with a focus on computer graphics and optimization. I blend creativity with code to build immersive 3D websites and efficient web systems. I’m excited to collaborate on projects that challenge the norm!
      </span>
     
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../theme/variables.scss";

.home-page {
  flex: 1;
  min-height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  .text {
    width: 100%;
    max-width: 300px;
    text-align: start;
    font-size: 1.5rem;
  }
}
</style>
