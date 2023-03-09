import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import Artist from '@/types/Artist'
import AudioInfo from '@/types/AudioInfo'
import SongWithArtist from '@/types/SongWithArtist'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    username: string;
    artists: Artist[];
    newArtistId: string;
    titleAndVersion: string;
    playAudio: boolean;
    audioPlaying: boolean;
    audioInfo: AudioInfo;
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}