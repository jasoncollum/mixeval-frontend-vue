<template>
  <div class="card-container">
    <!-- <img v-if="imageUrl" :src="imageUrl" />
    <img v-else src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" /> -->
    <!-- temporary image url -->
    <img src="https://thumbs.dreamstime.com/b/disco-mannequin-27120553.jpg" />
    <div v-if="songName" class="details">
      <h4>{{songName}}</h4>
      <p>{{artistName}}</p>
    </div>
    <div v-else class="details">
      <p>{{artistName}}</p>
      <!-- <p class="content is-small">
        {{artistSongCount}}
        <span v-if="artistSongCount === 1">Song</span>
        <span v-else>Songs</span>
      </p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtistSongCard',
  props: ['artistName', 'songName']
}
</script>

<style>
img {
  height: 48px;
  width: 48px;
  margin: 5px;
}
.card-container {
  display: flex;
}
.card-container:hover {
  cursor: pointer;
  background-color: rgb(248, 247, 247);
}
.details {
  margin: 5px;
}
</style>