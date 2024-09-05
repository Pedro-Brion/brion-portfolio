<script setup></script>

<template>
  <NavBar />
  <div class="content">
    <SideBar />
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
