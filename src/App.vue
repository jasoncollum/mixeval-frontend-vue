<template>
<div id="app">
  <Header />
  <Sidebar />
  <div id="audio-player-and-views" class="pt-4 px-4" :class="{'views-margin': username}">
    <AudioPlayer />
    <div>
        <router-view />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Header, 
    Sidebar,
    AudioPlayer,
  },
  computed: {
    username() {
      return this.$store.state.username
    }
  },
  beforeCreate() {
    this.$store.commit('initialiseStore')
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  min-width: 100vw;
}
#views {
  /* padding-top: 15px; */
}
.views-margin {
  margin-left: 340px;
}

/* For mobile phones: */
@media (max-width: 768px) {
  .views-margin {
    margin-left: 0;
  }
}
/* For tablets: */
@media (max-width: 1023px) {
  .views-margin {
    margin-left: 0;
  }
}
</style>
