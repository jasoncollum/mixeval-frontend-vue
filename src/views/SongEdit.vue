<template>
  <form @submit.prevent="handleUpdateSong">
    <div class="has-text-centered">Edit Song Info</div>

    <label>Song Title:</label>
    <input type="text" v-model="title" required />

    <label>Artist:</label>
    <select v-model="selected" required>
      <option v-for="artist in artistList" :value="{id: artist.id, name: artist.name}" :key="artist.id">
        {{ artist.name }}
      </option>
    </select>

    <div class="submit">
      <button class="button is-rounded">Update Song</button>
    </div>
    <div class="is-size-7 has-text-centered is-clickable" @click="$router.go(-1)">Cancel</div>
  </form>
</template>

<script lang="ts">
import ArtistDetail from '@/types/ArtistDetail';
import { defineComponent } from 'vue';

import axios from 'axios';
import SongWithArtist from '@/types/SongWithArtist';

export default defineComponent({
  name: 'SongEdit',
  data() {
    return {
      song: null as SongWithArtist | null,
      title: '',
      selected: {id: '', name: ''},
      previousPath: '',
      artistList: [] as ArtistDetail[],
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
    async handleUpdateSong() {
      // Patch request to update either song title OR artistId
      if (this.song && this.song.title === this.title && this.song.artistId === this.selected.id) {
        this.$router.go(-1);
        return;
      }
      try {
        const songId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/songs/${songId}`, {
          title: this.title,
          artistId: this.selected.id,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
      } catch (error) {
        // IMPROVE ERROR HANDLING
        console.log(error)
      }
      try {
        await this.$store.dispatch('requestArtistsWithOpenSongs');
      } catch (error) {
        // IMPROVE ERROR HANDLING
        console.log(error)
      }
      this.$router.go(-1);
    }
  },
  async mounted() {
    await this.getArtistsDetails();
    const song = this.$store.getters.getSongWithArtistBySongId(this.$route.params.id);
    if (Object.keys(song).length !== 0 && song.constructor === Object) {
      this.song = song;
      this.title = song.title;
      this.selected = {id: song.artistId, name: song.artistName}
    }
    this.previousPath = this.$router.options.history.state.back as string;
  },
})
</script>

<style>

</style>