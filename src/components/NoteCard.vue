<template>
  <div class="note-card px-4">
    <div class="">
      <div class="single-note-container" v-if="!note.edit">
        <span class="has-text-black-bis" @click="note['edit'] = !edit">{{note.text}}</span>
        <span 
          class="delete-note-btn has-text-grey is-pulled-right is-clickable" 
          @click="$emit('deletedNote', note.id)"
        >
          <span class="icon">
            <i class="fa-regular fa-trash-can"></i>
          </span>
        </span>
      </div>
      <br>
      <div v-if="note.edit">
        <textarea
          class="textarea mb-1"
          v-model="note.text"
        ></textarea>
        <div class="is-flex is-justify-content-flex-end">
          <div 
            class="is-clickable" 
            @click="$emit('editedNote', note.id, note.text); note.edit = false;"
          >
          <span class="icon mt-3">
            <i class="fa-solid fa-plus"></i>
          </span></div>
        </div>
      </div>
    </div>
    
    <!-- Revisions section -->
    <div class="ml-4">
      <div>
        <RevisionCard 
          v-for="revision in note.revisions"
          :key="revision.id"
          :revision="revision"
          @editedRevision="passEditedRevision"
          @deletedRevision="passDeletedRevision"
        />
      </div>
    </div>

    <!-- Create New Revision textarea -->
    <div class="ml-5">
      <div v-if="!showNewRevisionInput" class="mb-6">
        <span 
          @click="toggleShowNewRevisionInput" 
          class="is-clickable has-text-grey-light"
        >
          + New Revision
        </span>
      </div>
      <div v-show="showNewRevisionInput" class="has-text-centered">
        <textarea 
          class="textarea mb-2" 
          v-model="newRevisionText" 
          placeholder="Enter a revision..."
        >
        </textarea>
        <div class="is-flex is-justify-content-flex-end">
          <div 
            class="is-clickable" 
            @click="$emit('addNewRevision', newRevisionText, note.id); closeAndClearInput()"
          >
            <span class="icon mt-3">
              <i class="fa-solid fa-plus"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Note from '@/types/Note';
import RevisionCard from '../components/RevisionCard.vue';

export default defineComponent({
  name: 'NoteCard',
  props: {
    note: {
      required: true,
      type: Object as PropType<Note>
    }
  },
  components: {
    RevisionCard,
  },
  data() {
    return {
      showNewRevisionInput: false,
      newRevisionText: '',
    }
  },
  methods: {
    toggleShowNewRevisionInput() {
      this.showNewRevisionInput = !this.showNewRevisionInput;
    },
    closeAndClearInput() {
      this.newRevisionText = '',
      this.toggleShowNewRevisionInput();
    },
    passEditedRevision(revObj: {revisionId: string, revisionText: string, noteId: string}) {
      this.$emit('editedRevision', revObj)
    },
    passDeletedRevision(revObj: { revisionId: string, noteId: string }) {
      this.$emit('deletedRevision', revObj)
    }
  }
})
</script>

<style>
.delete-note-btn {
  display: none;
}

.single-note-container:hover .delete-note-btn {
  display: block;
}

.note-card-hr {
  width: 33%;
  margin: 0 auto 1.5rem auto;
}
</style>