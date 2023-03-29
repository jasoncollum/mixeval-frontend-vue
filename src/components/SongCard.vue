<template>
  <div 
    class="song-card-row-container is-clickable is-flex is-justify-content-space-between"
    @mouseover="hover = true" 
    @mouseleave="hover = false"
  >
    <div class="card-container is-flex">
      <figure class="image is-48x48 is-clipped mx-1 my-1">
        <!-- <img v-if="artistImage" :src="artistImage"/> -->
        <span v-if="audioInfo.versionId === versionId && audioPlaying && !hover" class="eq">
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
          <span class="bar bar-4"></span>
        </span>
        <img v-else-if="!hover"
          src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" 
        />
        <span v-show="(!audioPlaying && hover) || (audioInfo.versionId !== versionId && hover)"
          class="icon is-large" 
          @click="handlePlayPause"
        >
          <i class="fa-solid fa-play"></i>
        </span>
        <span v-show="audioInfo.versionId === versionId && audioPlaying && hover"
          class="icon is-large" 
          @click="handlePlayPause"
        >
          <i class="fa-solid fa-pause"></i>
        </span>
      </figure>   
      <div class="mx-1 my-1">
        <p class="top-line is-size-6">
          <span class="is-clickable" @click="handleSongTitleClick">{{songTitle}}</span>
          <span class="is-clickable" @click="handleVersionNumberClick"> MIX V{{versionNumber}}</span>
        </p>
        <p class="content is-size-7 is-clickable" @click="handleArtistNameClick">{{artistName}}</p>
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
    artistId: {
      required: true,
      type: String
    },
    artistName: {
      required: true,
      type: String
    },
    artistImage: {
      required: false,
      type: String
    },
    songId: {
      required: true,
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
    return {
      hover: false,
    }
  },
  computed: {
    audioPlaying() {
      return this.$store.state.audioPlaying;
    },
    audioInfo() {
      return this.$store.state.audioInfo;
    }
  },
  methods: {
    handleSongTitleClick() {
      this.$router.push(`/song/${this.songId}/details`);
    },
    handleArtistNameClick() {
      this.$router.push(`/artist/${this.artistId}/details`);
    },
    handleVersionNumberClick() {
      this.$router.push(`/version/${this.versionId}/edit`);
    },
    handleNotesClick() {
      this.$router.push(`/version/${this.versionId}/notes`);
    },
    handlePlayPause() {
      this.$store.dispatch('playFromSongCard', {
        titleAndVersion: `${this.songTitle} MIX V${this.versionNumber}`,
        audioInfo: {
          artistId: this.artistId,
          artistName: this.artistName,
          songTitle: this.songTitle,
          versionId: this.versionId,
          audioFileName: this.audioFileName
        }
      })
    }
  },
})
</script>

<style scoped>
.song-card-row-container:hover {
  background-color: rgb(248, 247, 247);
}

/* Audio Playing Bars */
.eq {
  width: 48px;
  height: 48px;
  transform: translate(-50%, -50%) scale(0.25); 
}

.bar {
  width: 18%;
  max-height: 65%;
  position: absolute;
  bottom: 20%;
  left: 12%;
  background: rgb(214, 214, 214);
  transition: height 0.4s ease;
  animation: bar 0.4s 0s both alternate ease infinite;
}

.bar-1 {
  /* left: 2%; */
  animation-delay: 0.2s;
}

.bar-2 {
  left: 32%;
    animation-delay: 0.4s;
}

.bar-3 {
  left: 54%;
    animation-delay: 0.6s;
}

.bar-4 {
  left: 75%;
    animation-delay: 0.8s;
}

@keyframes bar {
  0% {
    height: 0;
  }
  
  100% {
    height: 65%;
  }
}
</style>