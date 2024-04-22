<script setup></script>

<template>
  <div class="home-page">
    <div class="text">
      <h2>Oi!</h2>
      <span ref="info">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est odit sunt
        dignissimos vero sed. Delectus beatae voluptas minima, velit ipsa sequi
        tempora placeat alias, laboriosam enim nostrum, illum perferendis
        facere?
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../theme/variables.scss";

canvas {
  position: absolute;
  bottom: 0;
  right: 0;
}

.home-page {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;

  .text {
    width: 100%;
    max-width: 250px;
    text-align: end;
    font-size: 1.5rem;
  }
}
</style>
