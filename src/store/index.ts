import { createStore } from 'vuex'
import Artist from '@/types/Artist'
import SongWithArtist from '@/types/SongWithArtist'
import axios from 'axios';

// const axios = require('axios').default;

const store = createStore({
  state: {
    username: '',
    artists: [] as Artist[],
    newArtistId: '',
    // *** audio info + controls ***
    titleAndVersion: '',
    playAudio: false as boolean,
    audioPlaying: false as boolean,
    audioInfo: {
      artistName: '' as string,
      songTitle: '' as string,
      audioFileName: '' as string
    },
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('username')) { 
        state.username = JSON.parse(localStorage.username);
        if (localStorage.getItem('artists')) { 
          state.artists = JSON.parse(localStorage.artists);
          if (localStorage.getItem('titleAndVersion')) { 
            state.titleAndVersion = JSON.parse(localStorage.titleAndVersion);
            if (localStorage.getItem('audioInfo')) { 
              state.audioInfo = JSON.parse(localStorage.audioInfo);
            }
          }
        }
      }
    },
    setUsername(state, payload: string) {
      state.username = payload;
    },
    logoutUser(state) {
      state.username = '';
      state.artists = [];
      state.newArtistId = '';
      state.titleAndVersion = '';
      state.playAudio = false;
      state.audioPlaying = false;
      state.audioInfo = {
        artistName: '',
        songTitle: '',
        audioFileName: ''
      }
    },
    setArtists(state, payload: Artist[]) {
      state.artists = payload;
    },
    setNewArtistId(state, payload: string) {
      state.newArtistId = payload;
    },
    setPlayAudio(state, payload) {
        state.playAudio = payload;
        state.audioPlaying = payload;
    },
  },
  actions: {
    playFromSongCard({ commit, state }, payload) {
      if (state.titleAndVersion !== payload.titleAndVersion) {
        state.playAudio && commit('setPlayAudio', false);
        state.titleAndVersion = payload.titleAndVersion;
        state.audioInfo = payload.audioInfo;
      } else {
        // play or pause audio
        state.playAudio ? commit('setPlayAudio', false) : commit('setPlayAudio', true);
      }
    },
    async requestArtistsWithOpenSongs(context) {
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
      console.log('LOG OUT')
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
      if (state.artists) {
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
      }
    },
  },
  modules: {
  },
})

const unsubscribe = store.subscribe((mutation, state) => {
  localStorage.setItem('username', JSON.stringify(state.username));
  localStorage.setItem('artists', JSON.stringify(state.artists));
  localStorage.setItem('titleAndVersion', JSON.stringify(state.titleAndVersion));
  localStorage.setItem('audioInfo', JSON.stringify(state.audioInfo));
})

export default store;
