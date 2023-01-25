<template>
  <!-- Sign In -->
  <form @submit.prevent="handleSubmit">
    <label>Email:</label>
    <input type="email" required v-model="email" />
    
    <label>Password:</label>
    <input type="password" required v-model="password" />
    <div v-if="passwordError" class="error">{{ passwordError }}</div>

    <div class="submit">
      <button>Sign In</button>
    </div>
    <div class="is-size-7 has-text-centered">
      <router-link to="/signup" class="link">Sign Up</router-link>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const axios = require('axios').default;

export default defineComponent({
  name: 'SigninForm',
  data() {
    return {
      email: '',
      password: '',
      passwordError: '',
    }
  },
  methods: {
    setUsername(username: string) {
      this.$store.commit('setUsername', username)
    },
    async handleSubmit() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signin`, {
          email: this.email,
          password: this.password
        })
        
        const { accessToken, username } = response.data
        localStorage.setItem('token', accessToken)
  
        this.setUsername(username)
      } catch(error: any) {
        console.log(error.response.data.message)
      }

      try {
        this.$store.dispatch('getArtistsWithOpenSongs')
      } catch (error: any) {
        console.log(error.response.data.message)
      }
      this.$router.push({ path: '/'})
    }
  }
});
</script>

<style>

</style>