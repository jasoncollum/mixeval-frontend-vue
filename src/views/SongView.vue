<template>
  <!-- <nav class="navbar is-transparent is-hidden-touch">
    
    <div class="navbar-end">
      <select class="orderby-select">
        <option>Most Recent</option>
        <option>Song Title</option>
        <option>Artist Name</option>
      </select>
    </div>
  </nav> -->

  <!-- New Version Form -->
  <div v-if="showForm">
    <form @submit.prevent="handleCreateVersion">
      <div class="has-text-centered">{{song.title}}</div>

      <label>New Version Number:</label>
      <input type="number" v-model="newVersionNumber" required />

      <!-- Upload MP3 Audio -->
      <input 
        style="display: none" 
        type="file" accept=".mp3" 
        @change="onFileSelected" 
        ref="fileInput"
      />
      <div class="mt-3">
        <label class="is-clickable" @click="$refs.fileInput.click()">
          <i class="fa-solid fa-upload"></i>
          <span class="ml-2">Upload An Mp3:</span>
        </label>
        <span v-if="this.selectedFile" class="ml-2">{{selectedFile.name}}</span>
      </div>

      <div class="submit">
        <button v-if="!isUploading" class="button is-rounded">Create Version</button>
        <button v-if="isUploading" class="button is-rounded is-loading">Create Song</button>
        <p v-if="isUploading" class="has-text-grey-light mt-2 is-italic">Uploading Audio...</p>
      </div>

      <div>
        <p v-if="!isUploading" class="is-size-7 has-text-centered cancel" @click="handleHideForm">Cancel</p>
      </div>
    </form>
  </div>

  <!-- Song List -->
  <div class="songcard-container">
    <SongCard 
      v-for="version in song.versions"
      :key="version.id"
      :songId="song.id"
      :songTitle="song.title"
      :artistId="song.artistId"
      :artistName="song.artistName"
      :artistImage="song.artistImage"
      :versionNumber="version.number"
      :audioFileName="version.audioFileName"
      :versionId="version.id"
      @showForm="handleShowForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongCard from '../components/SongCard.vue'
import SongWithArtist from '@/types/SongWithArtist';
import { audioFileUpload, getAudioFile } from '../aws';
import axios from 'axios';


export default defineComponent({
  name: 'SongView',
  components: {
    SongCard,
  },
  data() {
    return {
      showForm: false,
      newVersionNumber: null as number | null,
      selectedFile: null as any,    // TYPESCRIPT selectedFile
      isUploading: false
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistBySongId(this.$route.params.id);
    },
  },
  methods: {
    handleShowForm() {
      this.showForm = true;
    },
    handleHideForm() {
      this.showForm = false;
    },
    async handleCreateVersion() {
      try {
        // Upload audio file to aws s3 bucket
        if (this.selectedFile && this.selectedFile.type === 'audio/mpeg') {
          this.isUploading = true;
          const artistId = this.song.artistId;
          const result = await audioFileUpload(artistId, this.selectedFile);

          if (result && result.statusText === 'OK') {
            // Post request to create new version in db
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/versions`, {
              songId: this.song.id,
              number: this.newVersionNumber,
              audioFileName: this.selectedFile.name as string
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            )
            this.$store.dispatch('requestArtistsWithOpenSongs');
            this.isUploading = false;
          }
        }
      } catch (error) {
        // IMPROVE ERROR HANDLING
        this.isUploading = false;
        console.log(error)
      }
      this.showForm = false;
    },
    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement & EventTarget;
      if (target.files) {
        this.selectedFile = target.files[0];
      }
    }
  },
  mounted() {
    // check that song is not an empty object
    if (Object.keys(this.song).length !== 0 && this.song.constructor === Object) {
      this.newVersionNumber = this.song.versions.length + 1;
    }
  },
  watch: {
    song() {
      // check that song is not an empty object
      if (Object.keys(this.song).length !== 0 && this.song.constructor === Object) {
        this.newVersionNumber = this.song.versions.length + 1;
      }
    }
  }
});
</script>

<style scoped>
.orderby-select {
  border-bottom: none;
}

.cancel:hover {
  cursor: pointer;
}
</style>