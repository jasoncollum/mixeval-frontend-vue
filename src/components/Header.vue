<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end" v-if="username">
        <router-link to="" class="navbar-item" @click="logout">Log Out</router-link>
        <router-link to="/" class="navbar-item">{{username}}</router-link>
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
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user_name')
      this.$store.commit('logoutUser')
      this.$router.push('/signin')
    },
  },
})
</script>

<style>

</style>