<template>
  <div class="mx-4 my-4">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && version">
        {{song.title}} MIX V{{version && version.number}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes</p>
    </div>
    <div id="notes-container">
      <p>Vocals seem like they could come up a little bit overall</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongWithArtist from '@/types/SongWithArtist';
import Version from '@/types/Version';

export default defineComponent({
  name: 'NotesView',
  data() {
    return {
      versionId: this.$route.params.id as String,
      version: null as Version | null
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.versionId);
    },
  },
  mounted() {
    this.version = this.song.versions.find(version => version.id === this.versionId) as Version;
  }
});
</script>

<style>
  
</style>