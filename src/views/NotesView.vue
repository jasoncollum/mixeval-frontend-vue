<template>
  <div class="mx-4 my-4">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && version">
        {{song.title}} MIX V{{version && version.number}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes</p>
    </div>
    <div id="notes-container" v-if="hasNotes">
      <Note 
        v-for="note in version.notes"
        :key="note.id"
        :id="note.id"
        :text="note.text"
        :revisions="note.revisions"
        :versionId="note.versionId"
      />
    </div>
    <div v-else class="has-text-centered">
      There are currently no notes for this mix version...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongWithArtist from '@/types/SongWithArtist';
import Version from '@/types/Version';
import Note from '../components/Note.vue'

export default defineComponent({
  name: 'NotesView',
  components: {
    Note,
  },
  data() {
    return {
      versionId: this.$route.params.id as String,
      version: null as Version | null,
      hasNotes: false, 
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.versionId);
    },
  },
  mounted() {
    this.version = this.song.versions.find(version => version.id === this.versionId) as Version;
    this.hasNotes = this.version.notes.length > 0;
  }
});
</script>

<style>
  
</style>