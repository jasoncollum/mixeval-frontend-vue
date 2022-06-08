<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
      <router-link to="/signin" class="navbar-item">Log In</router-link>
    </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
})
</script>

<style>

</style>