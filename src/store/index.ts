import { createStore } from 'vuex'
import Artist from '@/types/Artist'
import SongWithArtist from '@/types/SongWithArtist'

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
      state.username = payload;
    },
    logoutUser(state) {
      state.username = '';
      state.artists = [];
      state.newArtistId = '';
    },
    setArtists(state, payload: Artist[]) {
      state.artists = payload;
    },
    setNewArtistId(state, payload: string) {
      state.newArtistId = payload;
    },
  },
  actions: {
    async requestArtistsWithOpenSongs(context) {
      console.log('Store - fetching artists')
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
    async logoutUser(context) {
      await localStorage.clear();
      context.commit('logoutUser');
    }
  },
  getters: {
    getSongWithArtistBySongId: (state) => (songId: string) => {
      let foundSong = {} as SongWithArtist;
      state.artists.forEach(artist => {
        artist.songs.forEach(song => {
          if (song.id === songId) {
            foundSong = {
              ...song,
              artistName: artist.name,
              artistImage: artist.image_url
            }
            return;
          }
        })
      })
      return foundSong;
    },
    getSongWithArtistByVersionId: (state) => (versionId: string) => {
      let foundSong = {} as SongWithArtist;
      state.artists.forEach(artist => {
        artist.songs.forEach(song => {
          song.versions.forEach(version => {
            if (version.id === versionId) {
              foundSong = {
                ...song,
                artistName: artist.name,
                artistImage: artist.image_url
              }
              return;
            }
          })
        })
      })
      return foundSong;
    },
  },
  modules: {
  },
})

const unsubscribe = store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})

export default store;
