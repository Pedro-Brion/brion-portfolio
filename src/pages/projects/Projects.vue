<script setup>
import ProjectComponent from "@/components/ProjectComponent.vue";

const projects = [
  {
    title: "Boid Simulation (This Portfolio)",
    description:
      "As a front-end developer passionate about creating engaging web experiences, I built this Vue-powered portfolio with a real-time 3D boid simulation as its backdrop. Created using Three.js, the simulation brings together my love for computer graphics and optimization, with an octree structure managing spatial partitioning for smooth, dynamic interactions. It showcases my technical skill and creativity, blending art and code to create a visually striking, high-performance web experience. This project reflects my goal: building immersive, innovative 3D websites that leave a lasting impression.",
    githubUrl: "https://github.com/Pedro-Brion/brion-portfolio",
    tecs: [
      "i-logos-unocss",
      "i-carbon-logo-vue",
      "i-simple-icons-typescript",
      "i-logos-threejs",
    ],
  },
];
</script>

<template>
  <div class="projects-page">
    <div class="info">
      <h2>Projetos</h2>
      <ProjectComponent
        v-for="project of projects"
        :key="project.title"
        v-bind="project" />
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
    gap: 2rem;
  }
}
</style>
