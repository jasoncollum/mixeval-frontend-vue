import { createStore } from 'vuex'

const store = createStore({
  state: {
    username: localStorage.getItem('user_name'),
    artists: [
      {
        name: 'Jiminy Christmas',
        // image_url: 'https://www.disneyclips.com/imagesnewb/images/jiminy-cricket4.png'
      },
      {
        name: 'Perrin Lamb',
        image_url: 'https://www.digitalmusicnews.com/wp-content/uploads/2015/10/perrin_lamb.jpg'
      },
      {
        name: 'Lil Scotty Riggan',
        image_url: 'https://th.bing.com/th/id/R.4321234aaf7baa80d493ae552962f568?rik=xmP5tUsik99AlA&riu=http%3a%2f%2flyrics.christiansunite.com%2fimages%2fartists%2fartist_463.jpg&ehk=SbKsozObsX%2bRXfNOfwK5r%2fSALw2nVRSPrWlr7kjHwEY%3d&risl=&pid=ImgRaw&r=0'
      },
    ]
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
