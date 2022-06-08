import { createStore } from 'vuex'

const store = createStore({
  state: {
    username: null,
  },
  getters: {
  },
  mutations: {
    updateUsername(state, payload) {
      state.username = payload
    },
    logoutUser(state) {
      state.username = null
    }
  },
  actions: {
  },
  modules: {
  }
})

export default store;
