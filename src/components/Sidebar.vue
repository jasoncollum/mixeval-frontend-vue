<template>
  <aside v-show="username" class="menu sidebar">
    <!-- top panel container -->
    <div>
      <div class="top-panel-item">
        <router-link to="/profile">> {{username}}</router-link>
      </div>
      <div class="top-panel-item">O Search</div>
      <div class="top-panel-item">
        <router-link to="/create-artist">+ Create Artist</router-link>
      </div>
      <div class="top-panel-item">
        <router-link to="/create-song">+ Create Song</router-link>
      </div>
      <hr>
      <!-- <div class="top-panel-item">Open Songs</div> -->
      <div class="artists-songs-container">
        <span @click="listArtists" 
              class="artists-songs-spans" 
              :class="{'selected': selectArtists}">Artists
        </span> | <span 
              @click="listSongs" 
              class="artists-songs-spans"
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
    }
  }
})
</script>

<style>
.sidebar {
  position: fixed;    
  height: 100vh;
  /* width: 275px; */
  width: 340px;
  padding: 15px 15px 0 15px;
  text-align: left;
  border-right: 1px solid lightgray;
  background-color: white;
}
.top-panel-item {
  margin-bottom: 10px;
}
.top-panel-item:hover {
  color: #42b983;
  cursor: pointer;
}
.artists-songs-container {
  display: flex;
  justify-content: center;
}
.artists-songs-spans {
  margin: 0 10px 15px 10px;
}
.artists-songs-spans:hover {
  cursor: pointer;
}
.selected {
  color: #42b983;
}
</style>