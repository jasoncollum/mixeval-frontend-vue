<template>
  <nav class="navbar is-transparent is-fixed-top has-shadow px-1">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">MIXEVAL</router-link>
      <a 
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
      class="navbar-menu sidebar-links has-text-centered" 
      :class="{'is-active': isActive}" 
      @click="toggleBurger">
      <div class="navbar-start">
        <router-link to="/profile" class="navbar-item">{{username}}</router-link>
        <router-link to="/" class="navbar-item">Search</router-link>
        <router-link to="/create-artist" class="navbar-item">Create Artist</router-link>
        <router-link to="/create-song" class="navbar-item">Create Song</router-link>
        <router-link to="/" class="navbar-item">Artists</router-link>
        <router-link to="/" class="navbar-item">Songs</router-link>
      </div>
      <div class="navbar-end">
        <router-link to="/signin" class="navbar-item" @click="logout">
          Log Out
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
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
    logout() {
      this.$store.dispatch('logoutUser');
      this.$router.push('/signin');
    },
  },
})
</script>

<style scoped>
.sidebar-links {
  visibility: hidden;
}

/* For mobile phones: */
@media (max-width: 768px) {
  .sidebar-links {
    visibility: visible;
  }
}
/* For tablets: */
@media (max-width: 1023px) {
  .sidebar-links {
    visibility: visible;
  }
}
</style>