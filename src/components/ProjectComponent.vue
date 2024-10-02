<script setup lang="ts">
interface ProjectComponentProps {
  title: string;
  description: string;
  tecs: string[];
  githubUrl: string;
}

defineProps<ProjectComponentProps>();
</script>
<template>
  <div class="project">
    <span class="title">{{ title }}</span>
    <div class="tecs">
      <div class="icon" v-for="tec of tecs" :key="tec">
        <div :class="tec"></div>
      </div>
    </div>
    <span class="description">{{ description }}</span>
    <div class="links">
      <a :href="githubUrl" target="_blank" title="GitHub">
        <div class="icon">
          <div class="i-carbon-logo-github"></div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.project {
  display: flex;
  justify-content: end;
  flex-direction: column;
  gap: 1rem;
  &:hover {
    transform: scale(1.05);
  }
  .title {
    font-weight: 500;
  }
  .description {
    font-weight: 300;
    text-align: justify;
    font-size: 1.2rem;
  }

  .tecs {
    display: flex;
    justify-content: end;
    font-size: 0.5rem;
  }
}
</style>
