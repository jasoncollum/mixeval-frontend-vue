<template>
<div id="app">
  <Header />
  <Sidebar />
  <div id="views" :class="{'views-margin': username}">
    <router-view />
  </div>
</div>
</template>

<script lang="ts">
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'App',
  components: {
    Header, 
    Sidebar,
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
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
#views {
  padding-top: 15px;
}
.views-margin {
  margin-left: 340px;
}
</style>
