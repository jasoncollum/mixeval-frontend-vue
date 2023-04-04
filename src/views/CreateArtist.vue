<template>
  <!-- Create New Artist -->
  <form @submit.prevent="handleCreateArtist">
    <div class="has-text-centered">Create A New Artist</div>
    <label>Artist Name:</label>
    <input type="text" required v-model="name" />
    
    <label>Image Url (Optional):</label>
    <input type="text" v-model="image_url" />

    <div class="submit">
      <button class="button is-rounded">Create Artist</button>
    </div>

    <div class="is-size-7 has-text-centered">
      <router-link to="/" class="link">
        Cancel
      </router-link>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const axios = require('axios').default;

export default defineComponent({
  name: 'CreateArtist',
  data() {
    return {
      name: '',
      image_url: ''
    }
  },
  methods: {
    async handleCreateArtist() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/artists`,
          {
            name: this.name,
            image_url: this.image_url
          }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        const newArtistId = response.data.id as string
        if (newArtistId) {
          // Success notification
          this.$store.commit('setNotification', {
            type: 'success',
            message: 'New artist created'
          })
          this.$store.commit('setNewArtistId', newArtistId)
          this.$router.push('/create-song')
        }
      } catch(error: any) {
        //Error notification
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response.data.message
        })
      }
    },
  }
});
</script>

<style>
  
</style>