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
  <div class="">
    <SongCard />
    <SongCard />
    <SongCard />
    <SongCard />
  </div>

  <p>{{this.$router.options.history.state}}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongCard from '../components/SongCard.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SongCard,
  },
  data() {
    return {
      
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
</style>