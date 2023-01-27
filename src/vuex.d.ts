import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import Artist from '@/types/Artist'
import SongWithArtist from '@/types/SongWithArtist'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    username: string;
    artists: Artist[];
    newArtistId: string;
    songViewSong: SongWithArtist;
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}