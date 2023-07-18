<template>
  <nav class="navbar is-transparent is-fixed-top has-shadow px-1">
    <Notification />
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
      <a
        v-if="username" 
        role="button" 
        class="navbar-burger has-background-white" 
        aria-label="menu" 
        aria-expanded="false"
        :class="{'is-active': isActive}"
        @click="toggleBurger"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div 
      v-if="username" 
      class="navbar-menu has-text-centered" 
      :class="{'is-active': isActive}" 
    >
      <div class="navbar-start is-hidden-desktop">
        <router-link to="/profile" class="navbar-item">{{username}}</router-link>
        <router-link to="/" class="navbar-item">Search</router-link>
        <router-link to="/create-artist" class="navbar-item">Create Artist</router-link>
        <router-link to="/create-song" class="navbar-item">Create Song</router-link>
        <router-link to="/artists" class="navbar-item">Artists</router-link>
        <router-link to="/songs" class="navbar-item">Songs</router-link>
      </div>
      <div class="navbar-end">
        <router-link to="/signin" class="navbar-item" @click="handleLogout">
          Log Out
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Notification from './Notification.vue'

export default defineComponent({
  name: 'Header',
  components: {
    Notification
  },
  data() {
    return {
      isActive: false,
    }
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
  },
  methods: {
    toggleBurger() {
      this.isActive = !this.isActive;
    },
    async handleLogout() {
      this.$store.dispatch('logoutUser');
      localStorage.clear();
      this.$router.push(`/signin`);
    },
  },
})
</script>

<style>

</style>