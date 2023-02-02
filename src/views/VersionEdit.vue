<template>
  <!-- Edit Version -->
  <form @submit.prevent="handleCreateSong">
    <div class="has-text-centered">Create A New Song</div>

    <!-- Song Title Not Editable -->
    <label>Song Title:</label>

    <!-- Version Number Not Editable ? -->
    <label>Version Number:</label>

    <!-- Replace / Update Audio -->
    <label>New Audio File:</label>

    <!-- Buttons to Save changes, Delete version, Cancel -->

  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VersionEdit',

})

</script>

<style>

</style>