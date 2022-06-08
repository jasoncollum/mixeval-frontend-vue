<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <router-link to="/signin" class="navbar-item" v-if="!username">Log In</router-link>
        <router-link to="/" class="navbar-item" v-else>{{username}}</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  computed: {
    username() {
      return this.$store.state.username
    }
  }
})
</script>

<style>

</style>