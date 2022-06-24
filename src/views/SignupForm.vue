<template>
  <!-- Sign Up -->
  <form @submit.prevent="handleSubmit">
    <label>Username:</label>
    <input type="text" required v-model="username" />

    <label>Email:</label>
    <input type="email" required v-model="email" />
    
    <label>Password:</label>
    <input type="password" required v-model="password" />
    <div v-if="passwordError" class="error">{{ passwordError }}</div>

    <div class="submit">
      <button>Sign Up</button>
    </div>
    <div class="is-size-7 has-text-centered">
      <router-link to="/signin" class="link">Sign In</router-link>
    </div>
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
      passwordError: '',
    }
  },
  methods: {
    handleSubmit() {
      axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signup`, {
        username: this.username,
        email: this.email,
        password: this.password
      })
      .then((res: any) => console.log(res))
      .catch((error: any) => console.log(error))
      
      this.username = ''
      this.email = ''
      this.password = ''

      this.$router.push('/')
    }
  }
});
</script>

<style>

</style>