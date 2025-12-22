<script setup lang="ts">

import Calculator from '../components/Calculator.vue'; 
</script>

<template>
  <div class="home-page">
    <Calculator />
  </div>
</template>

<style scoped>

.home-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 50px;
  background-color: var(--bg-app, #f5f5f5);
}
</style>