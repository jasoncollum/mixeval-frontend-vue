<template>
  <div class="mx-4 my-4">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && versionNum">
        {{song.title}} MIX V{{versionNum}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes | Mix Revisions</p>
    </div>

    <div id="notes-container" v-if="hasNotes">
      <NoteCard 
        v-for="note in versionNotes"
        :key="note.id"
        :note="note"
      />
    </div>
    <div v-else class="has-text-centered">
      <textarea 
        class="textarea mt-5 mb-2" 
        v-model="newNoteText" 
        placeholder="Enter a note..."
      >
      </textarea>
      <div class="is-flex is-justify-content-flex-end">
        <div class="is-clickable mr-2" @click="pushNewNote">Done</div>
      </div>
    </div>

    <p class="has-text-centered is-clickable" @click="createNewNotes">Back</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongWithArtist from '@/types/SongWithArtist';
import Version from '@/types/Version';
import Note from '@/types/Note';
import NewNote from '@/types/NewNote';
import NoteCard from '../components/NoteCard.vue'

export default defineComponent({
  name: 'NotesView',
  components: {
    NoteCard,
  },
  data() {
    return {
      versionId: this.$route.params.id as string,
      versionNum: null as number | null,
      versionNotes: [] as Array<Note | NewNote>,
      hasNotes: false,
      newNoteText: '',
      newNoteCount: 0,
      // array of new notes to post
      newNotes: [] as Array<NewNote> 
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id as string);
    },
  },
  methods: {
    pushNewNote() {
      if (!this.newNoteText) {
        return
      }
      this.newNoteCount++;
      const newNote = {
        id: `newNote${(this.newNoteCount).toString()}`,
        text: this.newNoteText,
        versionId: this.versionId
      }
      this.versionNotes.push(newNote);
      this.newNoteText = '';
      this.hasNotes = this.versionNotes.length > 0;
    },
    createNewNotes() {
      // temporarily called by clicking on Back button ***
      this.newNotes = this.versionNotes.filter(note => note.id.includes('newNote'));
      console.log("NEW NOTES::", this.newNotes)

      this.$router.push(`/song/${this.song.id}`)
    }
  },
  mounted() {
    const version = this.song.versions.find(version => version.id === this.versionId) as Version;
    if (version) {
      this.versionNum = version.number;
      this.versionNotes = [...version.notes];
      this.hasNotes = this.versionNotes.length > 0;
    }
  }
});
</script>

<style>
  
</style>