import { createStore } from 'vuex'
import createPesistedState from 'vuex-persistedstate'
const axios = require('axios').default;

const store = createStore({
  state: {
    username: localStorage.getItem('user_name'),
    artists: localStorage.getItem('artists')
  },
  getters: {    
  
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
      const artists = response.data
      context.commit('setArtists', artists)
    }
  },
  modules: {
  },
  plugins: [createPesistedState()],
})

export default store;
