import { defineComponent } from 'vue';
<template>
  <div class="card-container is-flex">
    <figure class="image is-48x48 is-clipped mx-1 my-1">
      <!-- <img v-if="artistImage" :src="artistImage" /> -->
      <img :src="artistImage ? artistImage : defaultArtistImage" :key="artistImage" />
    </figure>
    <div v-if="songTitle" class="mx-1 my-1">
      <p class="top-line is-size-6">{{songTitle}}</p>
      <p class="content is-size-7">{{artistName}}</p>
    </div>
    <div v-else class="mx-1 my-1">
      <p class="top-line is-size-6">{{artistName}}</p>
      <p class="content is-size-7">
        {{artistSongCount}}
        <span v-if="artistSongCount === 1">Song</span>
        <span v-else>Songs</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ArtistSongCard',
  props: {
    artistName: {
      required: true,
      type: String
    },
    artistImage: {
      required: false,
      type: String
    },
    artistSongCount: {
      required: false,
      type: Number
    },
    songTitle: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      defaultArtistImage: process.env.VUE_APP_DEFAULT_ARTIST_IMAGE,
    }
  }
})
</script>

<style>
.card-container {
  width: 307px;
}
.card-container:hover {
  cursor: pointer;
  background-color: rgb(248, 247, 247);
}
</style>