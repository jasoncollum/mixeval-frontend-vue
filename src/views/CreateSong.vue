<template>
  <!-- Create New Song -->
  <form @submit.prevent="handleCreateSong">
    <div class="has-text-centered">Create A New Song</div>

    <label>Artist:</label>
    <select v-model="selectedArtistId" required @change="handleNewArtist">
      <option text='Choose an artist' value='' disabled></option>
      <option text='Create a new artist' value='create-new-artist'></option>
      <option v-for="artist in artistList" :value="artist.id" :key="artist.id">
        {{ artist.name }}
      </option>
    </select>

    <label>Song Title:</label>
    <input type="text" v-model="title" required />

    <div class="submit">
      <button class="button is-rounded">Create Song</button>
    </div>

    <div class="is-size-7 has-text-centered">
      <router-link to="/" class="link" @click="handleCreateSongLater">
        Create A Song Later
      </router-link>
    </div>
  </form>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArtistDetail from '@/types/ArtistDetail';
import Song from '@/types/Song';

const axios = require('axios').default;

export default defineComponent({
  name: 'CreateSong',
  async mounted() {
    await this.getArtistsDetails();
    this.selectedArtistId = this.$store.state.newArtistId;
  },
  data() {
    return {
      title: '',
      selectedArtistId: '',
      artistList: [] as ArtistDetail[],
      previousPath: this.$router.options.history.state,
    }
  },
  methods: {
    async getArtistsDetails() {
      // get artist details to populate select options
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/artists/details`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        this.artistList = response.data;
      } catch (error: any) {
        console.log(error.response.data.message)
      }
    },
    async handleCreateSong() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/songs`, {
          title: this.title,
          artistId: this.selectedArtistId,
          isOpen: true
        },
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        const createdSong: Song = response.data;
        this.$store.dispatch('requestArtistsWithOpenSongs');
        this.$store.commit('setNewArtistId', '');
        this.title = '';
        this.selectedArtistId = '';
        this.artistList = [];
        this.$router.push(`/song/${createdSong.id}`);
      } catch (error: any) {
        console.log(error.response.data.message)
      }
    },
    handleNewArtist() {
      if (this.selectedArtistId === 'create-new-artist') {
        this.$store.commit('setNewArtistId', '');
        this.$router.push('/create-artist');
      }
    },
    handleCreateSongLater() {
      this.$store.commit('setNewArtistId', '');
    }
  }
});
</script>

<style>
  
</style>