<template>
  <div>
    <div class="mb-6">
      <div v-if="!revision.edit">
        <span @click="revision['edit'] = !edit">{{revision.text}}</span>
        <span 
          class="is-pulled-right is-clickable" 
          @click="$emit('deletedRevision', { revisionId: revision.id, noteId: revision.noteId })"
        >
          delete
        </span>
      </div>
      <br>
      <div v-if="revision.edit">
        <textarea
          class="textarea mb-1"
          v-model="revision.text"
        ></textarea>
        <div class="is-flex is-justify-content-flex-end">
          <div 
            class="is-clickable" 
            @click="$emit('editedRevision', 
            {
              revisionId: revision.id, revisionText: revision.text, noteId: revision.noteId
            }); revision.edit = false; "
          >Done</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Revision from '@/types/Revision';

export default defineComponent({
  name: 'RevisionCard',
  props: {
    revision: {
      required: true,
      type: Object as PropType<Revision>
    }
  },
})
</script>