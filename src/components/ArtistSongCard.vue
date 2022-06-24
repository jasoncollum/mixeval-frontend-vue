import { defineComponent } from 'vue';
<template>
  <div class="card-container is-flex">
    <!-- <img v-if="imageUrl" :src="imageUrl" />
    <img v-else src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" /> -->
    <!-- temporary image url -->
    <figure class="image is-48x48 mx-1 my-1">
      <img src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" />
    </figure>
    <div v-if="songTitle" class="mx-1 my-1" @click="toSongView">
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
    artistSongCount: {
      required: true,
      type: Number
    },
    songTitle: {
      required: false,
      type: String
    }
  },
  methods: {
    toSongView() {
      this.$router.push('/song-view')
    }
  }
})
</script>

<style>
.card-container:hover {
  cursor: pointer;
  background-color: rgb(248, 247, 247);
}
</style>