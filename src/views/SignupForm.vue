<template>
  <!-- Sign Up -->
  <form @submit.prevent="handleSubmit">
    <label>Username:</label>
    <input type="text" required v-model="username" />

    <label>Email:</label>
    <input type="email" required v-model="email" />
    
    <label>Password:</label>
    <input type="password" required v-model="password" />

    <div class="submit">
      <button class="button is-rounded">Sign Up</button>
    </div>
    <div class="is-size-7 has-text-centered">
      <router-link to="/signin" class="link">Sign In</router-link>
    </div>
    <ul v-show="hasError">
       <li v-for="message in errorMessages" :key="message.index" class="has-text-danger my-4">{{message}}</li>
    </ul>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const axios = require('axios').default;

export default defineComponent({
  name: 'SignupForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      hasError: false,
      errorMessages: []
    }
  },
  methods: {
    async handleSubmit() {
      if (this.hasError) {
        this.hasError = false;
        this.errorMessages = [];
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signup`, {
          username: this.username,
          email: this.email,
          password: this.password
        })

        this.username = '';
        this.email = '';
        this.password = '';

        this.$router.push('/')
      } catch (error: any) {
        //Error notification
        this.hasError = true;
        this.errorMessages = error.response.data.message;
      }
    }
  }
});
</script>

<style>

</style>