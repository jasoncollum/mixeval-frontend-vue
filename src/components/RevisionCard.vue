<template>
  <div>
    <div class="pl-3">
      <div class="single-revision-container" v-if="!revision.edit">
        <span @click="revision['edit'] = !edit">{{revision.text}}</span>
          <span
          class="delete-revision-btn has-text-grey is-pulled-right is-clickable"
          @click="$emit('deletedRevision', { revisionId: revision.id, noteId: revision.noteId })"
        >
          <span class="icon">
            <i class="fa-regular fa-trash-can"></i>
          </span>
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

<style>
.delete-revision-btn {
  display: none;
}

.single-revision-container:hover .delete-revision-btn {
  display: inline-block;
}
</style>