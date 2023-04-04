<template>
  <!-- Create New Song -->
  <form @submit.prevent="handleCreateSong">
    <div class="has-text-centered">Create A New Song</div>

    <label>Artist:</label>
    <select v-model="selectedArtist" required @change="handleNewArtist">
      <option text='Choose an artist' :value="{id: '', name: ''}" disabled></option>
      <option text='Create a new artist' :value="{id: 'create-new-artist', name: ''}"></option>
      <option v-for="artist in artistList" :text="artist.name" :value="{id: artist.id, name: artist.name}" :key="artist.id">
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
      <button v-if="!isUploading" class="button is-rounded">Create Song</button>
      <button v-if="isUploading" class="button is-rounded is-loading">Create Song</button>
      <p v-if="isUploading" class="has-text-grey-light mt-2 is-italic">Uploading Audio...</p>
    </div>

    <div class="is-size-7 has-text-centered">
      <router-link to="/" class="link" @click="handleCreateSongLater">
        {{ (previousPath === '/create-artist' && selectedArtist.id) ? 'Create A Song Later' : 'Cancel' }}
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
      selectedArtist: {id: '', name: ''},
      artistList: [] as ArtistDetail[],
      selectedFile: null as any,        // <= TYPESCRIPT selectedFile
      previousPath: '',
      isUploading: false
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
          this.isUploading = true;
          const username = this.$store.state.username;
          const artistName = this.selectedArtist.name;
          const songTitle = this.title;
          const result = await audioFileUpload(this.selectedArtist.id, this.selectedFile);
          
          if (result && result.statusText === 'OK') {
            // Post request to create new song in db (as well as create version 1)
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/songs`, {
              title: this.title,
              artistId: this.selectedArtist.id,
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

            if (createdSong) {
              this.$store.dispatch('requestArtistsWithOpenSongs');
              this.$store.commit('setNewArtistId', '');
              this.isUploading = false;
              this.title = '';
              this.selectedArtist.id = '';
              this.selectedArtist.name = '';
              this.artistList = [];
              this.$router.push(`/song/${createdSong.id}`);
            }
          }
        }
      } catch (error: any) {
        //Error notification
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response.data.message
        })
        this.isUploading = false;
      }
    },
    handleNewArtist() {
      if (this.selectedArtist.id === 'create-new-artist') {
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
    const newArtistId = this.$store.state.newArtistId;
    if (newArtistId) {
      const newArtist = this.artistList.find(artist => artist.id === newArtistId);
      if (newArtist) {
        this.selectedArtist = newArtist;
      }
    }
    this.previousPath = this.$router.options.history.state.back as string;
  },
});
</script>

<style>
  
</style>