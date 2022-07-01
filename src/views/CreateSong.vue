<template>
  <div>
    This is the Create Song View ...
  </div>
  <div>{{newArtistId}}</div>
  <div>{{previousPath}}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreateSong',
  computed: {
    newArtistId() {
      return this.$store.state.newArtistId
    },
    previousPath() {
      console.log(this.$router.options.history.state)
      return this.$router.options.history.state
    }
  }
});
</script>

<style>
  
</style>