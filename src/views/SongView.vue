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
  <div class="songcard-container">
    <SongCard 
      v-for="version in song.versions"
      :key="version.id"
      :songTitle="song.title"
      :artistName="song.artistName"
      :versionNumber="version.number"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongCard from '../components/SongCard.vue'
import SongWithArtist from '@/types/SongWithArtist';

export default defineComponent({
  name: 'SongView',
  components: {
    SongCard,
  },
  data() {
    return {
      
    }
  },
  computed: {
    song() {
      return this.$store.state.songViewSong;
    }
  },
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
</style>