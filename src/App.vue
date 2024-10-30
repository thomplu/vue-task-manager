<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
    <div class="content">
        <router-view/>
    </div>
</template>

<script setup lang="ts">

    import { useStore } from '@/store';

    const store = useStore()

</script>

<style lang="scss">
@import "scss/_global.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: var(--page-padding);

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.content {
    padding: 0 20px;
}
</style>
