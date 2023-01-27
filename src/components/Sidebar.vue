<template>
  <aside v-show="username" class="menu sidebar has-background-white pt-4 pl-4">
    <!-- top panel container -->
    <div>
      <div class="mb-2">
        <router-link to="/profile">> {{username}}</router-link>
      </div>
      <div class="mb-2">O Search</div>
      <div class="mb-2">
        <router-link to="/create-artist">+ Create Artist</router-link>
      </div>
      <div class="mb-2">
        <router-link to="/create-song">+ Create Song</router-link>
      </div>
      <hr>
      <!-- <div class="top-panel-item">Open Songs</div> -->
      <div class="has-text-centered my-2">
        <span @click="listArtists" 
              class="artists-songs-spans mr-1" 
              :class="{'selected': selectArtists}">Artists
        </span> | <span 
              @click="listSongs" 
              class="artists-songs-spans ml-1"
              :class="{'selected': selectSongs}">Songs
        </span>
      </div>
    </div>
    <!-- artist | song card container -->
    <div v-if="selectArtists">
      <ArtistSongCard 
        v-for="artist in artists"
        :key="artist.id" 
        :artistName="artist.name"  
        :artistSongCount="artist.songs.length"
      />
    </div>
    <div v-else>
      <ArtistSongCard 
        v-for="song in songs"
        :key="song.id" 
        :songTitle="song.title"
        :artistName="song.artistName"
        @click="handleSongCardClick(song)"
      />
    </div>
  </aside>
</template>

<script lang="ts">
import ArtistSongCard from './ArtistSongCard.vue'
import SongWithArtist from '../types/SongWithArtist';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar',
  components: {
    ArtistSongCard,
  },
  data() {
    return {
      selectArtists: true,
      selectSongs: false,
    }
  },
  computed: {
    username() {
      return this.$store.state.username
    },
    artists() {
      return this.$store.state.artists
    },
    songs() {
      const songs: SongWithArtist[] = []
      if (this.artists.length > 0) {
        this.artists.forEach(artist => {
          artist.songs.forEach(song => {
            songs.push({...song, artistName: artist.name, artistImage: artist.image_url})
          })
        })
        return songs;
      }
    },
  },
  methods: {
    listSongs() {
      this.selectArtists = false;
      this.selectSongs = true;
    },
    listArtists() {
      this.selectSongs = false;
      this.selectArtists = true;
    },
    handleSongCardClick(song: SongWithArtist): void {
      if (this.songs) {
        this.$store.commit('setSongViewSong', song);
      }
      this.$router.push('/song-view');
    },
  }
})
</script>

<style>
.sidebar {
  position: fixed;    
  height: 100vh;
  width: 340px;
  border-right: 1px solid lightgray;
}
.artists-songs-spans:hover {
  cursor: pointer;
}
.selected {
  color: #42b983;
}
</style>