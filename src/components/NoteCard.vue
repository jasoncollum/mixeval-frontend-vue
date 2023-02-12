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
            @click="note.edit = false; $emit('editedNote', note.id, note.text)"
          >Done</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Note from '@/types/Note';

export default defineComponent({
  name: 'NoteCard',
  props: {
    note: {
      required: true,
      type: Object as PropType<Note>
    }
  },
  // methods: {
  //   handleEditedNote() {
  //     console.log("NOTE WAS EDITED")
  //   }
  // }
})
</script>