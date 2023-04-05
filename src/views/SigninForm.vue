<template>
  <!-- Sign In -->
  <form @submit.prevent="handleSubmit">
    <label>Email:</label>
    <input type="email" required v-model="email" />
    
    <label>Password:</label>
    <input type="password" autocomplete="on" required v-model="password" />

    <div class="submit">
      <button class="button is-rounded">Sign In</button>
    </div>
    <div class="is-size-7 has-text-centered">
      <router-link to="/signup" class="link">Sign Up</router-link>
    </div>
    <ul v-show="hasError">
       <li v-for="message in errorMessages" :key="message.index" class="has-text-danger my-4">
        {{ message }}
      </li>
    </ul>
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
      hasError: false,
      errorMessages: [] as string[],
    }
  },
  methods: {
    setUsername(username: string) {
      this.$store.commit('setUsername', username)
    },
    async handleSubmit() {
      if (this.hasError) {
        this.hasError = false;
        this.errorMessages = [];
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signin`, {
          email: this.email,
          password: this.password
        })
        
        const { accessToken, username } = response.data
        localStorage.setItem('token', accessToken)
  
        this.setUsername(username)
      } catch(error: any) {
        //Error notification
        this.hasError = true;
        if (typeof error.response.data.message === 'string') {
          this.errorMessages.push(error.response.data.message)
        } else {
          this.errorMessages = error.response.data.message;
        }
      }

      if (this.$store.state.username) {
        try {
        this.$store.dispatch('requestArtistsWithOpenSongs')
        } catch (error: any) {
          //Error notification
          this.$store.commit('setNotification', {
            type: 'error',
            message: error.response.data.message
          })
        }
        this.$router.push('/');
      }
    }
  }
});
</script>

<style>

</style>