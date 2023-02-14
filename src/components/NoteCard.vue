<template>
  <div>
    <div class="mb-6">
      <div v-if="!note.edit">
        <span @click="note['edit'] = !edit">{{note.text}}</span>
        <span 
          class="is-pulled-right is-clickable" 
          @click="$emit('deletedNote', note.id)"
        >
          delete
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
          >Done</div>
        </div>
      </div>
    </div>
    
    <!-- Revisions section -->
    <div id="revision-container">
      <RevisionCard 
        v-for="revision in note.revisions"
        :key="revision.id"
        :revision="revision"
        @editedRevision="passEditedRevision"
        @deletedRevision="passDeletedRevision"
      />
    </div>

    <!-- Create New Revision textarea -->
    <div class="mt-5 mb-6">
      <div v-if="!showNewRevisionInput" class="mb-2">
        <span 
          @click="toggleShowNewRevisionInput" 
          class="is-clickable"
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
          >Done</div>
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