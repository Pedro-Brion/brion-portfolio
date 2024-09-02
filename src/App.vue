<script setup></script>

<template>
  <NavBar />
  <div>
    <SideBar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
main {
  flex: 1;
  display: flex;
}

div {
  display: flex;
}
</style>
