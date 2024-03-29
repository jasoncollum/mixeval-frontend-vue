<template>
  <!-- Edit Version -->
  <form v-if="song" @submit.prevent="handleUpdateVersion">
    <div class="has-text-centered">{{song.title}} MIX V{{versionNumber}}</div>
     <!-- Upload MP3 Audio -->
    <input 
      style="display: none" 
      type="file" accept=".mp3" 
      @change="onFileSelected" 
      ref="fileInput"
    />
    <div class="has-text-centered">
      <label class="is-clickable" @click="$refs.fileInput.click()">
        <i class="fa-solid fa-upload"></i>
        <span class="ml-2">Upload A New Mp3:</span>
      </label>
      <div v-if="this.selectedFile" class="ml-2">{{selectedFile.name}}</div>
    </div>

    <div class="submit">
      <button v-if="!isUploading" class="button is-rounded">Update Audio</button>
      <button v-if="isUploading" class="button is-rounded is-loading">Create Song</button>
      <p v-if="isUploading" class="has-text-grey-light mt-2 is-italic">Uploading Audio...</p>
    </div>
    <div v-if="!isUploading" class="is-size-7 has-text-centered is-clickable" @click="$router.go(-1)">Cancel</div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Version from '@/types/Version';
import SongWithArtist from '@/types/SongWithArtist';
import { audioFileUpload } from '../aws';

import axios from 'axios';

export default defineComponent({
  name: 'VersionEdit',
  data() {
    return {
      versionNumber: null as Number | null,
      selectedFile: null as any,        // <= TYPESCRIPT selectedFile
      isUploading: false
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id);
    }
  },
  methods: {
    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement & EventTarget;
      if (target.files) {
        this.selectedFile = target.files[0];    // <= TYPESCRIPT this.selectedFile
      }
    },
    async handleUpdateVersion() {
      try {
        // Upload audio file to aws s3 bucket
        if (this.selectedFile && this.selectedFile.type === 'audio/mpeg') {
          this.isUploading = true;
          const artistId = this.song.artistId;
          const result = await audioFileUpload(artistId, this.selectedFile);

          if (result && result.statusText === 'OK') {
            // Patch request to Update Version audioFileName
            const token = localStorage.getItem('token');
            const versionId = this.$route.params.id;
            const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/versions/${versionId}`, {
              audioFileName: this.selectedFile.name
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            )
            this.$store.dispatch('requestArtistsWithOpenSongs');
            this.isUploading = false;
            this.versionNumber = null;
            this.selectedFile = null;
            this.$router.push(`/song/${this.song.id}`);
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
    }
  },
  mounted() {
    const song = this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id);
    if (Object.keys(song).length !== 0 && song.constructor === Object) {
      const version: Version = song.versions.find((version: Version) => {
        return version.id===this.$route.params.id;
      });
      if (version) {
        this.versionNumber = version.number;
      }
    }
  }
})

</script>

<style>

</style>