import { createStore } from 'vuex'

const store = createStore({
  state: {
    username: localStorage.getItem('user_name'),
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
