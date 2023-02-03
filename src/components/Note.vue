<template>
  <div class="note-container">
    <div>{{text}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import Revision from '@/types/Revision';

export default defineComponent({
  name: 'Note',
  props: {
    id: {
      required: true,
      type: String
    },
    text: {
      required: true,
      type: String
    },
    revisions: {
      required: true,
      type: Array
    },
    versionId: {
      required: true,
      type: String
    }
  },
})
</script>