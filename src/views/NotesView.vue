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
        @addNewRevision="handleAddNewRevision"
        @editedRevision="handleEditedRevision"
        @deletedRevision="handleDeletedRevision"
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
import { defineComponent, watchEffect } from 'vue';
import SongWithArtist from '@/types/SongWithArtist';
import Version from '@/types/Version';
import Note from '@/types/Note';
import NewNote from '@/types/NewNote';
import NoteCard from '../components/NoteCard.vue'
import Revision from '../types/Revision';
import Song from '@/types/Song';

const axios = require('axios').default;

export default defineComponent({
  name: 'NotesView',
  components: {
    NoteCard,
  },
  data() {
    return {
      token: null as string | null,
      versionId: this.$route.params.id as string,
      versionNum: null as number | null,
      // Notes
      versionNotes: [] as Array<Note | NewNote>,
      showNewNoteInput: true,
      newNoteText: '',
      // newNoteCount: 0,
      // newNotes: [] as Array<{ text: string, versionId: string}>,
      editedNoteIds: [] as Array<string>,
      hasDeletedNotes: false,
      // Revisions
      newRevisionText: '',
      newRevisionCount: 0,
      newRevisions: [] as Array<{ text: string, noteId: string }>,
      editedRevisionIds: [] as Array<string>,
      hasDeletedRevisions: false,
    }
  },
  computed: {
    song(): SongWithArtist {
      console.log('CPU PROP FIRED')
      return this.$store.getters.getSongWithArtistByVersionId(this.$route.params.id as string);
    },
  },
  methods: {
    // NOTE //////////////////////////////////////////////////// logic...
    toggleShowNewNoteInput(): void {
      this.showNewNoteInput = !this.showNewNoteInput;
    },
    removeNoteFromVersionNotes(noteId: string): void {
      // helper: removes note from versionNotes array
      const index = this.versionNotes.findIndex(note => note.id === noteId);
      if (index >= 0) {
        this.versionNotes.splice(index, 1);
      }
    },
    async addNewNote(): Promise<void> {
      this.toggleShowNewNoteInput();
      // check to see if new note has text
      if (this.newNoteText) {
        try {
          // const token = localStorage.getItem('token');
          const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/notes`,
            {
              text: this.newNoteText,
              versionId: this.versionId,
            }, 
            {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            }
          )
          console.log('RESPONSE', response.data)
          this.newNoteText = '';
          this.editedNoteIds.length > 0 && await this.patchEditedNotes();
          this.newRevisionCount > 0 && await this.postNewRevisions();
          await this.$store.dispatch('requestArtistsWithOpenSongs');
        } catch (error: any) {
          console.log(error.response.data.message)
        }
        // if edited notes, make api requests
        // this.editedNoteIds.length > 0 && await this.patchEditedNotes();
        // this.newRevisionCount > 0 && await this.postNewRevisions();
        // try {
        //   this.$store.dispatch('requestArtistsWithOpenSongs')
        // } catch (error: any) {
        //   console.log(error.response.data.message)
        // }
        // this.editedRevisionIds.length > 0 && await this.patchEditedRevisions();
      }
      // OLD addNewNote LOGIC -----
      // use the newNoteCount to assign temporary id to be used for :key when looping
      // this.newNoteCount++;
      // create a new note object and push to versionNotes
      // const newNote = {
      //   id: `newNote${(this.newNoteCount).toString()}`,
      //   text: this.newNoteText,
      //   revisions: [],
      //   versionId: this.versionId
      // }
      // this.versionNotes.unshift(newNote);
      // reset newNoteText value to empty string
      // this.newNoteText = '';
      // set hasNotes to show notes in case there were previously no notes
      // this.showNewNoteInput = this.versionNotes.length < 1;
    },
    async handleEditedNote(noteId: string, noteText: string): Promise<void> {
      if (!noteText) {
        // if no text - delete the note
        try {
          await this.handleDeletedNote(noteId);
          // filter editedNoteIds to REMOVE noteId from array
          this.editedNoteIds = this.editedNoteIds.filter(id => id !== noteId);
        } catch (error: any) {
          console.log(error.response.data.message)
        }
      // REMOVE note from versionNotes array
      // this.removeNoteFromVersionNotes(noteId);
      } else {
        // if text search editedNoteIds, if id not found, PUSH id to array
        const idFound = this.editedNoteIds.find(id => id === noteId);
        if (!idFound) {
          this.editedNoteIds.push(noteId);
        }
      }
    },
    async handleDeletedNote(noteId: string): Promise<void> {
      try {
        // const token = localStorage.getItem('token');
        const response = await axios.delete(`${process.env.VUE_APP_ROOT_API}/notes/${noteId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          }
        )
        this.hasDeletedNotes = true;
      } catch (error: any) {
        console.log(error.response.data.message)
      }
      // REMOVE note from versionNotes array
      this.removeNoteFromVersionNotes(noteId);
    },
    // async postNewNotes(): Promise<Boolean> {
    //   // loop over versionNotes, if id includes 'newNote' remove id and push to newNotes array

    //   this.versionNotes.forEach(note => {
    //     if (note.id && note.id.includes('newNote')) {
    //       this.newNotes.push({
    //         text: note.text,
    //         versionId: note.versionId
    //       })
    //     }
    //   });
    //   const newNotesToPost = [...this.newNotes];
    //   // New Notes post request...
    //   const hasNewNotes = newNotesToPost.length > 0;
    //   if (hasNewNotes) {
    //     try {
    //       const token = localStorage.getItem('token')
    //       const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/notes`,
    //         newNotesToPost, 
    //         {
    //           headers: {
    //             'Authorization': `Bearer ${token}`
    //           }
    //         }
    //       )
    //     } catch(error: any) {
    //       console.log(error.response.data.message)
    //     }
    //   }
    //   return hasNewNotes;
    // },
    async patchEditedNotes(): Promise<Boolean> {
      // for each editedNoteId, loop over versionNotes and push to editedNotes array
      const editedNotes: Partial<Note>[] = [];
      this.editedNoteIds.forEach(id => {
        let foundNote: Partial<Note> | undefined = this.versionNotes.find(note => note.id === id);
        if (foundNote) {
          const editedNote = {
            id: foundNote.id,
            text: foundNote.text,
            revisions: foundNote.revisions,
            versionId: foundNote.versionId
          }
          editedNotes.push(editedNote);
        }
      });

      // Edited Notes patch request...
      const hasEditedNotes = editedNotes.length > 0;
      if (hasEditedNotes) {
        try {
          // const token = localStorage.getItem('token')
          const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/notes`,
            editedNotes, 
            {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            }
          )
        } catch(error: any) {
          console.log(error.response.data.message)
        }
      }
      return hasEditedNotes;
    },
    // REVISION //////////////////////////////////////////////////// logic...
    handleAddNewRevision(text: string, noteId: string): void {
      // check to see if new revision has text
      if (!text) {
        return
      }
      // use the newRevisionCount to assign temporary id to be used for :key when looping
      this.newRevisionCount++;
      // create a new revision object and push to Note's Revisions array
      const newRevision: Revision = {
        id: `newRevision${(this.newRevisionCount).toString()}`,
        text,
        noteId,
      }
      const note = this.versionNotes.find(note => note.id === noteId);
      if (note) {
        note.revisions.push(newRevision);
      }
    },
    async handleEditedRevision({revisionId, revisionText, noteId}: {revisionId: string, revisionText: string, noteId: string}) {
      if (!revisionText) {
        console.log('REMOVING REV TEXT')
        if (!revisionId.includes('newRevision')) {
          // if no text and not a new revision - delete the note
          try {
            await this.handleDeletedRevision({revisionId, noteId});
            // filter editedRevisionIds to REMOVE revisionId from array
            this.editedRevisionIds = this.editedRevisionIds.filter(id => id !== revisionId);
          } catch (error: any) {
            console.log(error.response.data.message)
          }
        }
        // REMOVE revision from versionNotes array
        this.removeRevisionFromVersionNotes(revisionId, noteId);
      } else {
        if (!revisionId.includes('newRevision')) {
          console.log('EDITED REVISION', revisionId, noteId)
          // search editedNoteIds, if id not found, PUSH id to array
          const idFound = this.editedRevisionIds.find(id => id === revisionId);
          if (!idFound) {
            this.editedRevisionIds.push(revisionId);
          }
        }
      }
    },
    removeRevisionFromVersionNotes(revisionId: string, noteId: string) {
      // helper: removes revision from note.revisions array with versionNotes array
      let note = this.versionNotes.find(note => note.id === noteId);
      if (note) {
        const index = note.revisions.findIndex(revision => revision.id === revisionId);
        if (index >= 0) {
          note.revisions.splice(index, 1);
        }
      }
      console.log('Updated versionNotes', this.versionNotes)
    },
    async handleDeletedRevision({revisionId, noteId}: {revisionId: string, noteId: string}) {
      console.log('DELETE IDS', revisionId, noteId)
      if (!revisionId.includes('newRevision')) {
        try {
          // const token = localStorage.getItem('token');
          const response = await axios.delete(`${process.env.VUE_APP_ROOT_API}/revisions/${revisionId}`,
            {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            }
          )
          this.hasDeletedRevisions = true;
        } catch (error: any) {
          console.log(error.response.data.message)
        }
        console.log('HANDLE DELETED VERSION', revisionId, noteId)
        // REMOVE revision from note revision array in versionNotes array
        this.removeRevisionFromVersionNotes(revisionId, noteId)
      }
    },
    async postNewRevisions() {
      // search for new revisions versionNotes array
      this.versionNotes.forEach(note => {
        note.revisions.forEach(revision => {
          if (revision.id && revision.id.includes('newRevision')) {
            this.newRevisions.push({
              text: revision.text,
              noteId: revision.noteId
            })
          }
        })
      });
      const newRevisionsToPost = [...this.newRevisions];
      // New Notes post request...
      const hasNewRevisions = newRevisionsToPost.length > 0;
      if (hasNewRevisions) {
        try {
          // const token = localStorage.getItem('token')
          const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/revisions`,
            newRevisionsToPost, 
            {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            }
          )
        } catch(error: any) {
          console.log(error.response.data.message)
        }
      }
      return hasNewRevisions;
    },
  },
  mounted(): void {
    console.log('MOUNTED')
    // check that song is not an empty object
    if (Object.keys(this.song).length !== 0 && this.song.constructor === Object) {
      const version = this.song.versions.find(version => version.id === this.versionId) as Version;
      if (version) {
        this.versionNum = version.number;
        this.versionNotes = [...version.notes];
        this.showNewNoteInput = this.versionNotes.length < 1;
        this.token = localStorage.getItem('token');
      }
    }
  },
  watch: {
    song() {
      console.log('WATCH FIRED')
      // check that song is not an empty object
      if (Object.keys(this.song).length !== 0 && this.song.constructor === Object) {
        const version = this.song.versions.find(version => version.id === this.versionId) as Version;
        if (version) {
          this.versionNum = version.number;
          this.versionNotes = [...version.notes];
          this.showNewNoteInput = this.versionNotes.length < 1;
        }
      console.log('INSIDE THE WATCH')
      }
    }
  },
  created() {
    
  },
  // async beforeRouteLeave(to, from, next): Promise<void> {
  //   // Make API requests here...
  //   const hasEditedNotes = await this.patchEditedNotes();
  //   const hasNewRevisions = await this.postNewRevisions();
  //   console.log('hasEditedNotes', hasEditedNotes)
  //   console.log('hasNewRevisions', hasNewRevisions)
  //   console.log('hasDeletedNotes', this.hasDeletedNotes)
  //   console.log('hasDeletedRevisions', this.hasDeletedRevisions)
  //   console.log(this.$router.options.history.base)
  //   console.log('ROUTER', this.$router)
  //   if (
  //     hasEditedNotes || 
  //     this.hasDeletedNotes || 
  //     hasNewRevisions || 
  //     this.hasDeletedRevisions) {
  //     try {
  //       await this.$store.dispatch('requestArtistsWithOpenSongs')
  //     } catch (error: any) {
  //       console.log(error.response.data.message)
  //     }
  //   }
  //   next();
  // }
});
</script>

<style>
  
</style>