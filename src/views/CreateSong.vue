<template>
  <!-- Create New Song -->
  <form @submit.prevent="handleCreateSong">
    <div class="has-text-centered">Create A New Song</div>

    <label>Artist:</label>
    <select v-model="selected" required @change="handleNewArtist">
      <option text='Choose an artist' :value="{id: '', name: ''}" disabled></option>
      <option text='Create a new artist' :value="{id: 'create-new-artist', name: ''}"></option>
      <option v-for="artist in artistList" :value="{id: artist.id, name: artist.name}" :key="artist.id">
        {{ artist.name }}
      </option>
    </select>

    <label>Song Title:</label>
    <input type="text" v-model="title" required />

    <!-- <label>Upload MP3 Audio</label> -->
    <input 
      style="display: none" 
      type="file" accept=".mp3" 
      @change="onFileSelected" 
      ref="fileInput"
    />
    <div>
      <label class="is-clickable" @click="$refs.fileInput.click()">
        <i class="fa-solid fa-upload"></i>
        <span class="ml-2">Upload An Mp3:</span>
      </label>
      <span v-if="this.selectedFile" class="ml-2">{{selectedFile.name}}</span>
    </div>

    <div class="submit">
      <button class="button is-rounded">Create Song</button>
    </div>

    <div class="is-size-7 has-text-centered">
      <router-link to="/" class="link" @click="handleCreateSongLater">
        {{ (previousPath === '/create-artist' && selected.id) ? 'Create A Song Later' : 'Cancel' }}
      </router-link>
    </div>
  </form>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArtistDetail from '@/types/ArtistDetail';
import Song from '@/types/Song';
import { audioFileUpload } from '../aws';

const axios = require('axios').default;

export default defineComponent({
  name: 'CreateSong',
  data() {
    return {
      title: '',
      selected: {id: '', name: ''},
      artistList: [] as ArtistDetail[],
      selectedFile: null as any,        // <= TYPESCRIPT selectedFile
      previousPath: ''
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
        console.log(this.previousPath)
      } catch (error: any) {
        // IMPROVE ERROR HANDLING
        console.log(error.response.data.message)
      }
    },
    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement & EventTarget;
      if (target.files) {
        this.selectedFile = target.files[0];    // <= TYPESCRIPT this.selectedFile
      }
    },
    async handleCreateSong() {
      try {
        // Upload audio file to aws s3 bucket
        if (this.selectedFile && this.selectedFile.type === 'audio/mpeg') {
          const username = this.$store.state.username;
          const artistName = this.selected.name;
          const songTitle = this.title;
          const result = await audioFileUpload(this.selectedFile, username, artistName, songTitle);

          // Post request to create new song in db (as well as create version 1)
          const token = localStorage.getItem('token');
          const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/songs`, {
            title: this.title,
            artistId: this.selected.id,
            isOpen: true,
            audioFileNameForVersion: this.selectedFile.name
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
          this.selected.id = '';
          this.selected.name = '';
          this.artistList = [];
          this.$router.push(`/song/${createdSong.id}`);
        }
      } catch (error: any) {
        // IMPROVE ERROR HANDLING
        console.log(error.response.data.message)
      }
    },
    handleNewArtist() {
      if (this.selected.id === 'create-new-artist') {
        this.$store.commit('setNewArtistId', '');
        this.$router.push('/create-artist');
      }
    },
    handleCreateSongLater() {
      this.$store.commit('setNewArtistId', '');
    }
  },
  async mounted() {
    await this.getArtistsDetails();
    this.selected.id = this.$store.state.newArtistId;
    this.previousPath = this.$router.options.history.state.back as string;
  },
});
</script>

<style>
  
</style>