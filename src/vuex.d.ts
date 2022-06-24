import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import Artist from '@/types/Artist'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    username: string;
    artists: Artist[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}