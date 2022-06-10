<template>
  <aside class="menu sidebar">
    <!-- top panel container -->
    <div>
      <div class="top-panel-item">> {{username}}</div>
      <div class="top-panel-item">O Search</div>
      <div class="top-panel-item">+ Create Artist</div>
      <div class="top-panel-item">+ Create Song</div>
      <hr>
      <div class="top-panel-item">Open Songs</div>
      <div class="top-panel-item">Artists | Songs</div>
    </div>
    <!-- artist | song card container -->
    <div>
      <ArtistSongCard 
        v-for="artist in artists" 
        :key="artist.id" 
        :imageUrl="artist.image_url"
        :artistName="artist.name"
        :artistSongNumber="artist.songs.length"
      />
    </div>
  </aside>
</template>

<script>
import ArtistSongCard from './ArtistSongCard.vue'

export default {
  name: 'Sidebar',
  components: {
    ArtistSongCard,
  },
  computed: {
    username() {
      return this.$store.state.username
    },
    artists() {
      return this.$store.state.artists
    },
  },
}
</script>

<style>
.sidebar {
  position: fixed;    
  height: 100vh;
  width: 275px;
  padding: 65px 15px 0 15px;
  text-align: left;
  border-right: 1px solid lightgray;
}
.top-panel-item {
  margin-bottom: 10px;
}
.top-panel-item:hover {
  color: #42b983;
  cursor: pointer;
}
</style>