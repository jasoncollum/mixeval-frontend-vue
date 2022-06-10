import { createStore } from 'vuex'
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
      localStorage.removeItem('token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('artists')
      state.username = null
      state.artists = null
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
      localStorage.setItem('artists', JSON.stringify(artists))
    }
  },
  modules: {
  }
})

export default store;
