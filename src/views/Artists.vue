<template>
  <ArtistSongCard
    class="artist-list-card" 
    v-for="artist in artists"
    :key="artist.id" 
    :artistName="artist.name" 
    :artistImage="artist.image_url" 
    :artistSongCount="artist.songs.length"
    @click="handleArtistCardClick(artist.id)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArtistSongCard from '../components/ArtistSongCard.vue';

export default defineComponent({
  name: 'Artists',
  components: {
    ArtistSongCard,
  },
  data() {
    return {}
  },
  computed: {
    artists() {
      return this.$store.state.artists;
    }
  },
  methods: {
    handleArtistCardClick(id: string): void {
      this.$router.push(`/artist/${id}/details`);
    },
  }
})
</script>

<style scoped>
.artist-list-card {
  width: 100%;
}
.artist-list-card:nth-of-type(odd) {
  background-color: rgb(248, 247, 247);
}
</style>