<script setup>
const navLinks = [
  {
    name: "Projects",
    route: "home,",
  },
  {
    name: "About",
    route: "home,",
  },
  {
    name: "Contact",
    route: "home,",
  },
];
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <span v-for="navLink in navLinks" class="link" :key="navLink.route">
        {{ navLink.name }}
      </span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import "../theme/variables";

.navbar {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid $primaryDark;
  .container {
    flex: 1;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    padding-right: 16px;
    align-items: flex-end;
    gap: 8px;

    .link {
      padding: 5px 8px;
      cursor: pointer;
      transition: background-color 400ms ease-in-out;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      &:hover {
        background-color: #00000020;
      }
    }
  }
}

.dark {
  .navbar {
    border-color: $primaryLight;
  }
}
</style>
