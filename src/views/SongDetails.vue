<template>
  <div id="song-details" class="mt-6">
    <div class="container details is-flex is-flex-direction-row is-justify-content-center">
      <img :src="song.artistImage" class="artist-image"/>
      <div class="ml-6 is-size-4 mt-5">
        <h1>{{song.artistName}}</h1>
        <h2 class="mt-4">{{song.title}}</h2>
        <p class="is-size-6 mt-4">
            {{song.versions.length}}
            <span> Mix Version<span v-if="song.versions.length > 1">s</span>
          </span>
        </p>
        <span class="icon edit-icon is-size-4 mt-4 is-clickable is-pulled-right" @click="handleEditClick">
          <i class="fa-regular fa-pen-to-square"></i>
        </span>
      </div>
    </div>
    <div class="has-text-centered mt-6 is-clickable" @click="this.$router.go(-1);">Back</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongWithArtist from '@/types/SongWithArtist';

export default defineComponent({
  name: 'SongDetails',
  data() {
    return{
      showEdit: false,
    }
  },
  computed: {
    song(): SongWithArtist {
      return this.$store.getters.getSongWithArtistBySongId(this.$route.params.id);
    },
  },
  methods: {
    handleEditClick() {
      this.$router.push(`/song/${this.song.id}/edit`)
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
  }
  .details:hover .edit-icon {
    display: block;
  }
</style>