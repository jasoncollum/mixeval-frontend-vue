<template>
  <aside v-show="username" class="menu sidebar">
    <!-- top panel container -->
    <div>
      <div class="top-panel-item">
        <router-link to="/profile">> {{username}}</router-link>
      </div>
      <div class="top-panel-item">O Search</div>
      <div class="top-panel-item">
        <router-link to="/create-artist">+ Create Artist</router-link>
      </div>
      <div class="top-panel-item">
        <router-link to="/create-song">+ Create Song</router-link>
      </div>
      <hr>
      <div class="top-panel-item">Open Songs</div>
      <div class="top-panel-item">Artists | Songs</div>
    </div>
    <!-- artist | song card container -->
    <div v-if="Array.isArray(artists)">
      <ArtistSongCard 
        v-for="artist in artists" 
        :key="artist.id" 
        :artistName="artist.name"       
      />
    </div>
  </aside>
</template>

<script>
import ArtistSongCard from './ArtistSongCard.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',
  components: {
    ArtistSongCard,
  },
  computed: {
    username() {
      return this.$store.state.username
    },
    ...mapGetters([
      'artists',
    ])
  },
}
</script>

<style>
.sidebar {
  position: fixed;    
  height: 100vh;
  width: 275px;
  padding: 15px 15px 0 15px;
  text-align: left;
  border-right: 1px solid lightgray;
  background-color: white;
}
.top-panel-item {
  margin-bottom: 10px;
}
.top-panel-item:hover {
  color: #42b983;
  cursor: pointer;
}
</style>