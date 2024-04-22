<script setup></script>

<template>
  <div class="projects-page">
    <div class="info">
      <h2>Projetos</h2>
      <div class="project">
        <span class="title">Projeto 1 - </span>
        <span class="subtitle">breve explicação</span>
      </div>
      <div class="project">
        <span class="title">Projeto 2 - </span>
        <span class="subtitle">breve explicação</span>
      </div>
      <div class="project">
        <span class="title">Projeto 3 - </span>
        <span class="subtitle">breve explicação</span>
      </div>
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

.projects-page {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;

  .info {
    width: 100%;
    max-width: 500px;
    font-size: 1.5rem;
    text-align: end;
    display: flex;
    flex-direction: column;
    gap: 18px;

    .project {
      &:hover {
        font-size: 1.7rem;
      }
      .title {
        font-weight: 500;
      }
      .subtitle{
        font-weight: 300;
      }
    }
  }
}
</style>
