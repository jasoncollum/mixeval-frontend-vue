<template>
  <div class="mx-4 my-4">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && versionNum">
        {{song.title}} MIX V{{versionNum}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes | Mix Revisions</p>
    </div>

    <!-- Create New Note textarea -->
    <div class="mt-5 mb-6">
      <div class="mb-2">
        <span 
          @click="toggleShowNewNoteInput" 
          class="is-clickable"
        >
          {{showNewNoteInput ? 'Close' : '+ New Note'}}
        </span>
      </div>
      <div v-show="showNewNoteInput" class="has-text-centered">
        <textarea 
          class="textarea mb-2" 
          v-model="newNoteText" 
          placeholder="Enter a note..."
        >
        </textarea>
        <div class="is-flex is-justify-content-flex-end">
          <div class="is-clickable" @click="addNewNote">Done</div>
        </div>
      </div>
    </div>

    <!-- Notes section -->
    <div id="notes-container">
      <NoteCard 
        v-for="note in versionNotes"
        :key="note.id"
        :note="note"
        @editedNote="handleEditedNote"
        @deletedNote="handleDeletedNote"
      />
    </div>

    <p class="has-text-centered">
      <span 
        class="is-clickable" 
        @click="$router.go(-1)"
      >Back</span>
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

const axios = require('axios').default;

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
      showNewNoteInput: true,
      newNoteText: '',
      newNoteCount: 0,
      // array of new notes to post
      newNotes: [] as Array<{ text: string, versionId: string}>,
      editedNoteIds: [] as Array<string>,
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id as string);
    },
  },
  methods: {
    toggleShowNewNoteInput() {
      this.showNewNoteInput = !this.showNewNoteInput;
    },
    removeNoteFromVersionNotes(noteId: string) {
      // helper: removes note from versionNotes array
      const index = this.versionNotes.findIndex(note => note.id === noteId);
      if (index >= 0) {
        this.versionNotes.splice(index, 1);
      }
    },
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
      this.showNewNoteInput = this.versionNotes.length < 1;
    },
    async handleEditedNote(noteId: string, noteText: string) {
      if (!noteText) {
        if (!noteId.includes('newNote')) {
          // if no text and not a newnote - delete the note
          try {
            await this.handleDeletedNote(noteId);
            // filter editedNoteIds to REMOVE noteId from array
            this.editedNoteIds = this.editedNoteIds.filter(id => id !== noteId);
            // REMOVE note from versionNotes array
            this.removeNoteFromVersionNotes(noteId);
          } catch (error: any) {
            console.log(error.response.data.message)
          }
        }
      } else {
        if (!noteId.includes('newNote')) {
          // search editedNoteIds, if id not found, PUSH id to array
          const idFound = this.editedNoteIds.find(id => id === noteId);
          if (!idFound) {
            this.editedNoteIds.push(noteId);
          }
        }
      }
    },
    async handleDeletedNote(noteId: string) {
      if (!noteId.includes('newNote')) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.delete(`${process.env.VUE_APP_ROOT_API}/notes/${noteId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
          // REMOVE note from versionNotes array
          this.removeNoteFromVersionNotes(noteId);
        } catch (error: any) {
          console.log(error.response.data.message)
        }
      }
    },
    async postNewNotes(): Promise<void> {
      // ^ method currently called by clicking on Back button ***
      // loop over versionNotes, if id includes 'newNote' remove id and push to newNotes array
      // const newNotes = [] as Array<{ text: string, versionId: string}>;

      this.versionNotes.forEach(note => {
        if (note.id && note.id.includes('newNote')) {
          this.newNotes.push({
            text: note.text,
            versionId: note.versionId
          })
        }
      });
      const newNotesToPost = [...this.newNotes];
      // New Notes post request...
      if (newNotesToPost.length > 0) {
        console.log('NEW NOTES POSTING', newNotesToPost)
        try {
          const token = localStorage.getItem('token')
          const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/notes`,
            newNotesToPost, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
        } catch(error: any) {
          console.log(error.response.data.message)
        }
      }
    },
    async patchEditedNotes(): Promise<void> {
      // ^ method currently called by clicking on Back button ***
      // for each editedNoteId, loop over versionNotes and push to editedNotes array
      // *** editedNotes temporarily Partial<Note> - correct when revision logic added ***
      const editedNotes: Partial<Note>[] = [];
      this.editedNoteIds.forEach(id => {
        let foundNote: Partial<Note> | undefined = this.versionNotes.find(note => note.id === id);
        if (foundNote) {
          const editedNote = {
            id: foundNote.id,
            text: foundNote.text,
            versionId: foundNote.versionId
          }
          editedNotes.push(editedNote);
        }
      });

      // Edited Notes patch request...
      console.log(editedNotes);
      if (editedNotes.length > 0) {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/notes`,
            editedNotes, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
        } catch(error: any) {
          console.log(error.response.data.message)
        }
      }
      return
    }
  },
  mounted() {
    const version = this.song.versions.find(version => version.id === this.versionId) as Version;
    if (version) {
      this.versionNum = version.number;
      this.versionNotes = [...version.notes];
      this.showNewNoteInput = this.versionNotes.length < 1;
    }
  },
  async beforeRouteLeave(to, from, next) {
    // Make API requests here...
;
    this.postNewNotes();
    this.patchEditedNotes();
    next();
  }
});
</script>

<style>
  
</style>