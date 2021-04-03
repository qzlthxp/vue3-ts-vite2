<template>
  <nav-bar></nav-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from './components/navBar/NavBar.vue';

export default defineComponent({
  name: 'DashBoard',
  components: {
    NavBar,
  },
});
</script>

<style></style>
