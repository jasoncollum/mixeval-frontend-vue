<template>
  <div>
    <div class="mb-6">
      <span 
        v-if="!note.edit" @click="note['edit'] = !edit" 
      >{{note.text}}</span> 
      <br>
      <div v-if="note.edit">
        <textarea
          class="textarea mb-1"
          v-model="note.text"
        ></textarea>
        <div class="is-flex is-justify-content-flex-end">
          <div class="is-clickable mr-2" @click="note.edit = false">Done</div>
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
    // id: {
    //   required: true,
    //   type: String
    // },
    // text: {
    //   required: true,
    //   type: String
    // },
    // revisions: {
    //   required: true,
    //   type: Array as PropType<Array<Revision>>
    // },
    // versionId: {
    //   required: true,
    //   type: String
    // }
    note: {
      required: true,
      type: Object as PropType<Note>
    }
  },
})
</script>