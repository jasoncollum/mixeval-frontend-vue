import { createStore } from 'vuex'
import Artist from '@/types/Artist'

const axios = require('axios').default;

const store = createStore({
  state: {
    username: '',
    artists: [] as Artist[],
    newArtistId: '',
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('store')) {
        this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store') || ''))
				);
      }
    },
    setUsername(state, payload: string) {
      state.username = payload
    },
    logoutUser(state) {
      state.username = ''
      state.artists = []
      state.newArtistId = ''
      localStorage.clear()
    },
    setArtists(state, payload: Artist[]) {
      state.artists = payload
    },
    setNewArtistId(state, payload: string) {
      state.newArtistId = payload
    }
  },
  actions: {
    async getArtistsWithOpenSongs(context) {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/artists?hasOpenSongs=true`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const artists: Artist[] = response.data
      context.commit('setArtists', artists)
    },
    updateNewArtistId(context, id: string) {
      context.commit('setNewArtistId', id)
    }
  },
  getters: {
  },
  modules: {
  },
})

const unsubscribe = store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})

export default store;
