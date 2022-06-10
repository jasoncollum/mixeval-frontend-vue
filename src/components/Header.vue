<template>
  <nav class="navbar is-transparent is-fixed-top">
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
.navbar {
  border-bottom: 1px solid lightgray;
}
</style>