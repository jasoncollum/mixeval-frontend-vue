<template>
  <div class="song-card-row-container is-clickable is-flex is-justify-content-space-between">
    <div class="card-container is-flex">
      <figure class="image is-48x48 is-clipped mx-1 my-1">
        <!-- <img v-if="artistImage" :src="artistImage"/> -->
        <img @click="handlePlayPause" src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" />
      </figure>   
      <div class="mx-1 my-1">
        <p class="top-line is-size-6">{{songTitle}} MIX V{{versionNumber}}</p>
        <p class="content is-size-7">{{artistName}}</p>
      </div>
    </div>

    <div class="mx-1 my-1" @click="$emit('showForm')">New Version</div>

    <div class="mx-1 my-1" @click="handleNotesClick">Notes</div>

    <div class="mx-1 my-1">3:25</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SongCard',
  props: {
    artistName: {
      required: true,
      type: String
    },
    artistImage: {
      required: false,
      type: String
    },
    songTitle: {
      required: true,
      type: String
    },
    versionNumber: {
      required: true,
      type: Number
    },
    audioFileName: {
      required: true,
      type: String
    },
    versionId: {
      required: true,
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    isPlaying() {
      console.log('SongCard AudioPlaying::', this.$store.state.audioPlaying);
    }
  },
  methods: {
    handleNotesClick() {
      this.$router.push(`/version/${this.versionId}/notes`);
    },
    handlePlayPause() {
      this.$store.dispatch('playFromSongCard', {
        titleAndVersion: `${this.songTitle} MIX V${this.versionNumber}`,
        audioInfo: {
          artistName: this.artistName,
          songTitle: this.songTitle,
          audioFileName: this.audioFileName
        }
      })
    }
  }
})
</script>

<style>
.song-card-row-container:hover {
  background-color: rgb(248, 247, 247);
}
</style>