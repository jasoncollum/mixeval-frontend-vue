<template>
  <div class="my-4">
    <div class="container">
    <div class="mb-5">
      <div class="has-text-centered" v-if="song && versionNum">
        {{song.title}} MIX V{{versionNum}} by {{song.artistName}}
      </div>
      <p class="has-text-centered">Client Notes | Mix Revisions</p>
    </div>

    <!-- Create New Note textarea -->
    <div class="has-text-centered">
      <div class="mb-3">
        <span 
          @click="toggleShowNewNoteInput" 
          class="is-clickable has-text-grey"
        >
          <span v-if="showNewNoteInput" class="icon">
            <i class="fa-solid fa-minus"></i>
          </span>
          <span v-else>
            + New Note
          </span>
        </span>
      </div>
      <div v-show="showNewNoteInput" class="has-text-centered">
        <textarea 
          class="textarea" 
          v-model="newNoteText" 
          placeholder="Enter a note..."
        >
        </textarea>
        <div class="is-flex is-justify-content-flex-end mt-3">
          <div class="is-clickable has-text-grey" @click="addNewNote">
            <span class="icon">
              <i class="fa-solid fa-plus"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes section -->
    <div id="" class="mt-4">
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

    <div class="has-text-centered" @click="$router.go(-1)">
      <span class="icon mt-3 is-clickable">
        <i class="fa-solid fa-caret-left"></i>
      </span>
      <span class="is-clickable">Back</span>
    </div>
  </div>
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
// import Song from '@/types/Song';

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
      editedNoteIds: [] as Array<string>,
      hasDeletedNotes: false,
      // Revisions
      newRevisionText: '',
      newRevisionCount: 0,
      newRevisions: [] as Array<{ text: string, noteId: string }>,
      editedRevisionIds: [] as Array<{id: string, noteId: string}>,
      hasDeletedRevisions: false,
    }
  },
  computed: {
    song(): SongWithArtist {
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
      }
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
        // if no text and not a new revision - delete the revision
        if (!revisionId.includes('newRevision')) {
          try {
            await this.handleDeletedRevision({revisionId, noteId});
            // filter editedRevisionIds to REMOVE revisionId from array
            this.editedRevisionIds = this.editedRevisionIds.filter(obj => obj.id !== revisionId);
          } catch (error: any) {
            console.log(error.response.data.message)
          }
        }
        // REMOVE revision from versionNotes array
        this.removeRevisionFromVersionNotes(revisionId, noteId);
      } else {
        // if edited revision does have text and is not a new revision...
        if (!revisionId.includes('newRevision')) {
          // search editedRevisionIds, if id not found, PUSH id to array
          const idFound = this.editedRevisionIds.find(obj => obj.id === revisionId);
          if (!idFound) {
            this.editedRevisionIds.push({
              id: revisionId,
              noteId,
            });
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
      // if revision is not a new revision - delete revision
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
      }
      // remove deleted revision from versionNotes array
      this.removeRevisionFromVersionNotes(revisionId, noteId)
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
    async patchEditedRevisions(): Promise<Boolean> {
      // for each editedRevisionId, loop over versionNotes and push to editedRevisions array
      const editedRevisions: Partial<Revision>[] = [];
      this.editedRevisionIds.forEach(obj => {
        let note = this.versionNotes.find(note => note.id === obj.noteId);
        if (note) {
          let foundRevision = note.revisions.find(revision => revision.id === obj.id);
        if (foundRevision) {
          const editedRevision = {
            id: foundRevision.id,
            text: foundRevision.text,
            noteId: foundRevision.noteId
          }
          editedRevisions.push(editedRevision);
          }
        }
      });

      // Edited Notes patch request...
      const hasEditedRevisions = editedRevisions.length > 0;
      if (hasEditedRevisions) {
        try {
          // const token = localStorage.getItem('token')
          const response = await axios.patch(`${process.env.VUE_APP_ROOT_API}/revisions`,
            editedRevisions, 
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
      return hasEditedRevisions;
    },
  },
  mounted(): void {
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
  async beforeRouteLeave(to, from, next): Promise<void> {
    // Make API requests here...
    const hasEditedNotes = await this.patchEditedNotes();
    const hasNewRevisions = await this.postNewRevisions();
    const hasEditedRevisions = await this.patchEditedRevisions();
    if (
      hasEditedNotes || 
      this.hasDeletedNotes ||
      // hasEditedRevisions || 
      hasNewRevisions || 
      this.hasDeletedRevisions) {
      try {
        await this.$store.dispatch('requestArtistsWithOpenSongs')
      } catch (error: any) {
        console.log(error.response.data.message)
      }
    }
    next();
  }
});
</script>

<style>

</style>