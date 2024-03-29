<template id="template">
  <aside v-show="username" id="sidebar" class="menu has-background-white pt-5 px-4 is-hidden-touch">
    <!-- top panel container -->
    <div>
      <div class="mb-2 is-clickable" @click="$router.push('/profile')">
        <span class="icon">
          <i class="fa-regular fa-user"></i>
        </span>
        <span class="ml-1">{{username}}</span>
      </div>
      <div class="mb-2 is-clickable" @click="$router.push('/')">
        <span class="icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <span class="ml-1">Search</span>
      </div>
      <div class="mb-2 is-clickable" @click="$router.push('/create-artist')">
        <span class="icon">
          <i class="fa-solid fa-plus"></i>
        </span>
        <span class="ml-1">Create Artist</span>
      </div>
      <div class="mb-2 is-clickable" @click="$router.push('/create-song')">
        <span class="icon">
          <i class="fa-solid fa-plus"></i>
        </span>
        <span class="ml-1">Create Song</span>
      </div>
      <hr>
      <!-- <div class="top-panel-item">Open Songs</div> -->
      <div class="has-text-centered my-2 mb-3">
        <span @click="listArtists" 
              class="artists-songs-spans mr-1" 
              :class="{'faded': !selectArtists}">Artists
        </span> | <span 
              @click="listSongs" 
              class="artists-songs-spans ml-1"
              :class="{'faded': !selectSongs}">Songs
        </span>
      </div>
    </div>
    <!-- artist | song card container -->
    <div v-if="selectArtists">
      <ArtistSongCard 
        v-for="artist in artists"
        :key="artist.id" 
        :artistName="artist.name" 
        :artistImage="artist.image_url" 
        :artistSongCount="artist.songs.length"
        @click="handleArtistCardClick(artist.id)"
      />
    </div>
    <div v-else>
      <ArtistSongCard 
        v-for="song in songs"
        :key="song.id" 
        :songTitle="song.title"
        :artistName="song.artistName"
        :artistImage="song.artistImage"
        @click="handleSongCardClick(song.id)"
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
    handleArtistCardClick(id: string): void {
      this.$router.push(`/artist/${id}/details`);
    },
    handleSongCardClick(id: string): void {
      this.$router.push(`/song/${id}`);
    },
  }
})
</script>

<style scoped>
#sidebar {
  position: fixed;    
  height: 100vh;
  width: 340px;
  overflow: auto;
  border-right: 1px solid lightgray;
}
.artists-songs-spans:hover {
  cursor: pointer;
}
.faded {
  color: rgb(184, 182, 182);
}
</style>