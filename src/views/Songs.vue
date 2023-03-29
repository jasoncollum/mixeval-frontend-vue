<template>
  <ArtistSongCard 
    class="song-list-card"
    v-for="song in songs"
    :key="song.id" 
    :songTitle="song.title"
    :artistName="song.artistName"
    :artistImage="song.artistImage"
    @click="handleSongCardClick(song.id)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArtistSongCard from '../components/ArtistSongCard.vue';
import SongWithArtist from '../types/SongWithArtist';

export default defineComponent({
  name: 'Songs',
  components: {
    ArtistSongCard,
  },
  data() {
    return {}
  },
  computed: {
    artists() {
      return this.$store.state.artists;
    },
    songs() {
      const songs: SongWithArtist[] = []
      if (this.artists.length > 0) {
        this.artists.forEach(artist => {
          artist.songs.forEach(song => {
            songs.push({...song, artistName: artist.name, artistImage: artist.image_url})
          })
        })
        return songs;
      }
    },
  },
  methods: {
    handleSongCardClick(id: string): void {
      this.$router.push(`/song/${id}`);
    },
  }
})
</script>

<style>
.song-list-card {
  width: 100%;
}
.song-list-card:nth-of-type(odd) {
  background-color: rgb(248, 247, 247);
}
</style>