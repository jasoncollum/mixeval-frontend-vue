<template>
  <div id="waveform" class="has-text-centered">
    This is the Song View ... Audio Wave Form will go here...
  </div>
  <nav class="navbar is-transparent">
    
    <div class="navbar-end">
      <select class="orderby-select">
        <option>Most Recent</option>
        <option>Song Title</option>
        <option>Artist Name</option>
      </select>
    </div>
  </nav>

  <!-- New Version Modal -->
  <div v-if="showForm">
    <form @submit.prevent="handleCreateVersion">
      <div class="has-text-centered">{{song.title}}</div>

      <label>New Version Number:</label>
      <input type="number" v-model="newVersionNumber" required />

      <div class="submit">
        <button class="button is-success is-light is-rounded">Create Version</button>
      </div>

      <div>
        <p class="is-size-7 has-text-centered cancel" @click="handleClose">Cancel</p>
      </div>
    </form>
  </div>

  <!-- Song List -->
  <div class="songcard-container">
    <SongCard 
      v-for="version in song.versions"
      :key="version.id"
      :songTitle="song.title"
      :artistName="song.artistName"
      :versionNumber="version.number"
      :versionId="version.id"
      @showForm="handleShowForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongCard from '../components/SongCard.vue'
import SongWithArtist from '@/types/SongWithArtist';

const axios = require('axios').default;

export default defineComponent({
  name: 'SongView',
  components: {
    SongCard,
  },
  data() {
    return {
      showForm: false,
      newVersionNumber: null as Number | null
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
    handleClose() {
      this.showForm = false;
    },
    async handleCreateVersion() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/versions`, {
          songId: this.song.id,
          number: this.newVersionNumber,
        },
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        this.$store.dispatch('requestArtistsWithOpenSongs');
      } catch (error) {
        console.log(error)
      }
      this.showForm = false;
    }
  },
  mounted() {
    this.newVersionNumber = this.song.versions.length + 1;
  },
  watchEffect: {
    song() {
      this.newVersionNumber = this.song.versions.length + 1;
    }
  }
});
</script>

<style>
#waveform {
  background-color: rgb(241, 246, 248);
  height: 148px;
}
.orderby-select {
  border-bottom: none;
}

.cancel:hover {
  cursor: pointer;
}
</style>