<template>
  <nav class="navbar is-transparent is-fixed-top has-shadow px-1">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <router-link to="" class="navbar-item" @click="logout" v-if="username">Log Out</router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  computed: {
    username() {
      return this.$store.state.username
    },
  },
  methods: {
    logout() {
      this.$store.commit('logoutUser')
      this.$router.push('/signin')
    },
  },
})
</script>

<style>

</style>