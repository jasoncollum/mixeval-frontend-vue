<template>
  <div class="mx-4 my-4">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && versionNum">
        {{song.title}} MIX V{{versionNum}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes | Mix Revisions</p>
    </div>

    <!-- Create New Note textarea -->
    <div class="has-text-centered mb-6">
      <textarea 
        class="textarea mt-5 mb-2" 
        v-model="newNoteText" 
        placeholder="Enter a note..."
      >
      </textarea>
      <div class="is-flex is-justify-content-flex-end">
        <div class="is-clickable mr-2" @click="addNewNote">Done</div>
      </div>
    </div>

    <!-- Notes section -->
    <div id="notes-container">
      <NoteCard 
        v-for="note in versionNotes"
        :key="note.id"
        :note="note"
      />
    </div>

    <p class="has-text-centered">
      <span class="is-clickable" @click="postNewNotes">Back</span>
    </p>
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
      newNotes: [] as Array<Partial<NewNote>>
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id as string);
    },
  },
  methods: {
    addNewNote() {
      // check to see if new note has text
      if (!this.newNoteText) {
        return
      }
      // use the newNoteCount to assign temporary id to be used for :key when looping
      this.newNoteCount++;
      // create a new note object and push to versionNotes
      const newNote = {
        id: `newNote${(this.newNoteCount).toString()}`,
        text: this.newNoteText,
        versionId: this.versionId
      }
      this.versionNotes.unshift(newNote);
      // reset newNoteText value to empty string
      this.newNoteText = '';
      // set hasNotes to show notes in case there were previously no notes
      this.hasNotes = this.versionNotes.length > 0;
    },
    postNewNotes() {
      // ^ method currently called by clicking on Back button ***
      // loop over versionNotes, if id includes 'newNote' remove id and push to newNotes array
      this.versionNotes.forEach(note => {
        if (note.id && note.id.includes('newNote')) {
          this.newNotes.push({
            text: note.text,
            versionId: note.versionId
          })
        }
      });
      
      // post request will go here...
      console.log("VERSION NOTES::", this.versionNotes)
      console.log("NEW NOTES TO BE POSTED::", this.newNotes)

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