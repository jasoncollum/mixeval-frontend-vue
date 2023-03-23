import { defineComponent } from 'vue';
<template>
  <div id="artist-details" class="mt-6">
    <div class="container details is-flex is-flex-direction-row is-justify-content-center">
      <img :src="artist.image_url" class="artist-image"/>
      <div class="ml-6 is-size-4 mt-5">
        <h1>{{artist.name}}</h1>
        <p class="is-size-6 mt-4">
            {{artist.songs.length}}
            <span> Song<span v-if="artist.songs.length !== 1">s</span>
          </span>
        </p>
        <span class="icon edit-icon is-size-4 is-clickable" @click="handleEditClick">
          <i class="fa-regular fa-pen-to-square"></i>
        </span>
      </div>
    </div>
    <div class="has-text-centered mt-6" @click="this.$router.go(-1);">
      <span class="icon mt-3 is-clickable">
        <i class="fa-solid fa-caret-left"></i>
      </span>
      <span class="is-clickable">Back</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Artist from '../types/Artist';

export default defineComponent({
  name: 'ArtistDetails',
  data() {
    return {

    }
  },
  computed: {
    artist(): Artist {
      return this.$store.getters.getArtistById(this.$route.params.id);
    }
  },
  methods: {
    handleEditClick() {
      this.$router.push(`/artist/${this.artist.id}/edit`);
    }
  }
})
</script>

<style scoped>
  .artist-image {
    width: 200px;
    height: 200px;
  }
  .edit-icon {
    display: none;
    margin-top: auto;
  }
  .details:hover .edit-icon {
    display: block;
    margin-top: 40%;
    margin-left: auto;
  }
</style>