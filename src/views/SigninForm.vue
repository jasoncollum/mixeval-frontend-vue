<template>
  <h1>Sign In</h1>
  <form @submit.prevent="handleSubmit">
    <label>Email:</label>
    <input type="email" required v-model="email" />
    
    <label>Password:</label>
    <input type="password" required v-model="password" />
    <div v-if="passwordError" class="error">{{ passwordError }}</div>

    <div class="submit">
      <button>Sign In</button>
    </div>
    <div class="signup">
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
    async handleSubmit() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signin`, {
          email: this.email,
          password: this.password
        })
        
        const accessToken = response.data.accessToken

        if (!accessToken) {
          this.$router.push('/signin')
        }

        localStorage.setItem('token', accessToken)
        console.log(`Hello, ${response.data.username}`)
        this.$router.push('/')

      } catch(error: any) {
        console.log(error.response.data.message)
      }
    }
  }
});
</script>

<style>
.signup {
  font-size: 0.8em;
  text-align: center;
  margin-top: 10px;
}
</style>