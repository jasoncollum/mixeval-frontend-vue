import { defineComponent } from 'vue';
<template>
  <form @submit.prevent="handleUpdateArtist">
    <div class="has-text-centered">Edit Artist Info</div>

    <label>Artist Name:</label>
    <input type="text" required v-model="name" />
    
    <label>Image Url (Optional):</label>
    <input type="text" v-model="image_url" />

    <div class="submit">
      <button class="button is-rounded">Update Artist</button>
    </div>
    <div class="is-size-7 has-text-centered is-clickable" @click="$router.go(-1)">Cancel</div>
  </form>
</template>

<script lang="ts">
import Artist from '@/types/Artist';
import { defineComponent } from 'vue';

import axios from 'axios';

export default defineComponent({
  name: 'ArtistEdit',
  data() {
    return {
      artist: null as Artist | null,
      name: '',
      image_url: '',
    }
  },
  methods: {
    async handleUpdateArtist() {
      // Patch request to update either artist name OR artist image url
      if (this.artist && this.artist.name === this.name && this.artist.image_url === this.image_url) {
        this.$router.go(-1);
        return;
      }
      try {
        const artistId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/artists/${artistId}`, {
          name: this.name,
          image_url: this.image_url,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
      } catch (error: any) {
        //Error notification
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response.data.message
        })
      }
      try {
        await this.$store.dispatch('requestArtistsWithOpenSongs');
      } catch (error: any) {
        //Error notification
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response.data.message
        })
      }
      this.$router.go(-1);
    }
  },
  mounted() {
    const artist: Artist = this.$store.getters.getArtistById(this.$route.params.id);
    if (Object.keys(artist).length !== 0 && artist.constructor === Object) {
      this.artist = artist;
      this.name = artist.name;
      this.image_url = artist.image_url;
    }
  }
})
</script>

<style scoped>

</style>