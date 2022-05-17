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
    handleSubmit() {
      axios.post(`${process.env.VUE_APP_ROOT_API}/auth/signin`, {
        email: this.email,
        password: this.password
      })

      .then((res: any) => console.log(res))
      .catch((error: any) => console.log(error))
      this.email = ''
      this.password = ''
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