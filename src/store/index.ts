import { createStore } from 'vuex'

const axios = require('axios').default;

const store = createStore({
  state: {
    username: localStorage.getItem('username'),
    artists: localStorage.getItem('artists')
  },
  getters: {    
    artists(state) {
      if (typeof(state.artists) === 'string') {
        return JSON.parse(state.artists)
      }
      return state.artists
    }
  },
  mutations: {
    updateUsername(state, payload) {
      state.username = payload
    },
    logoutUser(state) {
      state.username = null
      state.artists = null
      localStorage.clear()
    },
    setArtists(state, payload) {
      state.artists = payload
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
      const artists = JSON.stringify(response.data)
      context.commit('setArtists', artists)
      localStorage.setItem('artists', artists)
    }
  },
  modules: {
  },
})

export default store;
