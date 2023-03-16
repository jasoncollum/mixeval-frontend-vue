<template>
  <div v-show="username" id="audio-player">
    <div v-if="isLoading">
      <div id="loading-audio-message" class="has-text-centered">Loading Audio {{percent}}%</div>
      <!-- <progress id="progress-bar" class="progress is-small">10%</progress> -->
    </div>
    <div id="waveform"></div>
      <div class="is-flex is-flex-direction-row mx-1 mt-5">
        <div v-if="showPlayPause" class="is-clickable" @click="playPause">
          <span v-if="audioPlaying" class="icon is-large">
            <i class="fa-solid fa-pause"></i>
          </span>
          <span v-else class="icon is-large">
            <i class="fa-solid fa-play"></i>
          </span>
        </div>
      <div v-if="showPlayPause" class="ml-4 my-auto has-text-weight-semibold">
        {{titleAndVersion}} by {{audioInfo.artistName}}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import WaveSurfer from 'wavesurfer.js';
import { getAudioFile } from '../aws';

export default defineComponent({
  name: 'AudioPlayer',
  data() {
    return {
      percent: 0,
      isLoading: false,
      showPlayPause: false,
    }
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    audioInfo() {
      return this.$store.state.audioInfo;
    },
    audioPlaying() {
      return this.$store.state.audioPlaying;
    },
    titleAndVersion() {
      return this.$store.state.titleAndVersion;
    },
    playAudio() {
      return this.$store.state.playAudio;
    }
  },
  methods: {
    setPercent(percentage) {
      console.log(percentage)
    },
    playPause() {
      if (!this.audioPlaying) {
        this.wavesurfer.play();
        this.$store.commit('setPlayAudio', true)
      } else {
        this.wavesurfer.pause();
        this.$store.commit('setPlayAudio', false)
      }
    },
    stopLoader(value) {
        this.isLoading = false;
    },
    async loadWavesurfer() {
      try {
        // wavesurfer event listeners
        this.wavesurfer.on('error', (error) => {
          console.log(error)
        })

        this.wavesurfer.on('finish', () => {
          this.wavesurfer.pause();
          this.$store.commit('setPlayAudio', false)
        })

        this.wavesurfer.on('loading', (percentage) => {
         this.percent = percentage;
        })

        this.wavesurfer.on('ready', () => {
          this.stopLoader();
        })

        // load wavesurfer audio
        this.isLoading = true;
        const url = await getAudioFile(
          this.username, 
          this.audioInfo.artistName, 
          this.audioInfo.songTitle, 
          this.audioInfo.audioFileName
        );
        this.wavesurfer.load(url);

        this.showPlayPause = true
      } catch (error) {
        // IMPROVE ERROR HANDLING
        console.log(error);
      }
    }
  },
  watch: {
    titleAndVersion() {
      if (this.titleAndVersion && this.audioInfo.audioFileName) {
        this.loadWavesurfer();
      }
    },
    playAudio() {
      if (this.playAudio) {
        this.wavesurfer.play();
      }
      if (!this.playAudio) {
        this.wavesurfer.pause();
      }
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      responsive: true,
      waveColor: 'gray',
      progressColor: 'lightgray',
      pixelRatio: 1,
      });
      if (this.titleAndVersion) {
        this.loadWavesurfer();
      }
    })
  }
});
</script>

<style scoped>
  #audio-player {
    min-height: 200px;
    position: relative;
  }

  #loading-audio-message {
    position: absolute;
    top: 60px;
    left: 40%;
    right: 40%;
    z-index: 2;
  }

  .playPause {
    z-index: 1;
  }

  span {
    padding: auto;
    border: 1px solid gray;
    border-radius: 50%;
    width: 48px;
  }

  i {
    font-size: 24px;
  }

  i.fa-play {
    margin-left: 5px;
    margin-top: 1px;
  }

  i.fa-pause {
    margin-top: 1px;
    margin-left: 1px;
  }
</style>
