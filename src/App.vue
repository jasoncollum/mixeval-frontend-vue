<template>
<div id="app">
  <Header />
  <Sidebar />
  <div id="views">
    <router-view />
  </div>
</div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Header, 
    Sidebar,
  },
}
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
  margin-left: 275px;
  padding-top: 15px;
}
</style>
