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
    <div class="signup">
      <router-link to="/signup" class="link">Sign Up</router-link>
    </div>
  </form>
</template>

<script>
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
    updateUsername(username) {
      this.$store.commit('updateUsername', username)
    },
    async handleSubmit() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signin`, {
          email: this.email,
          password: this.password
        })
        
        const { accessToken, username } = response.data
        localStorage.setItem('token', accessToken)
        localStorage.setItem('username', username)
  
        this.updateUsername(username)
      } catch(error) {
        console.log(error.response.data.message)
      }

      try {
        this.$store.dispatch('getArtistsWithOpenSongs')
      } catch (error) {
        console.log(error.response.data.message)
      }

      this.$router.push('/')
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